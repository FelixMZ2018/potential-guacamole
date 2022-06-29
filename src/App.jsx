import React, { useState, useEffect, createContext, useRef } from 'react'
import { Row, Col, Collapse, Image, Alert, Layout, Menu } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
} from '@ant-design/icons'
import './App.css'
import mqtt from 'mqtt'
import FCTGraphSelection from './components/FCTGraphSelection'
import MQTTSelector from './components/MQTTSelector'
import CommandLogs from './components/CommandLogs'
import DataGenerator from './components/DataGenerator'
import { FCTGraph } from '@ospin/fct-graph'

const { Header, Sider, Content } = Layout
export const QosOption = createContext([])
const qosOption = [
  {
    label: '0',
    value: 0,
  }, {
    label: '1',
    value: 1,
  }, {
    label: '2',
    value: 2,
  },
]

function loadFCTFromStorage() {
  const savedFCTGraphString = localStorage.getItem('fctGraph')
  if (!savedFCTGraphString) return null
  try {
    const graphInstance = new FCTGraph(JSON.parse(savedFCTGraphString))
    return graphInstance
  } catch (error) {
    return null
  }
}

const ConnectedApp = () => {
  const [client, setClient] = useState(null)
  const [isSubed, setIsSub] = useState(false)
  const [connectStatus, setConnectStatus] = useState('Offline')
  const [fctGraph, setFctGraph] = useState(loadFCTFromStorage())
  const [collapsed, setCollapsed] = useState(false)
  const [activeView, setActiveView] = useState('deviceSetup')
  const [ subs, setSubs ] = useState([])
  const [ messages, setMessages] = useState([])
  const [ newMessage, setNewMessage ] = useState(null)

  const mqttConnect = (host, mqttOption) => {
    setConnectStatus('Connecting')
    setClient(mqtt.connect(host, mqttOption))
  }

  useEffect(() => {
    if (client) {
      client.on('connect', () => {
        setConnectStatus('Connected')
      })
      client.on('error', err => {
        console.error('Connection error: ', err)
        client.end()
      })
      client.on('reconnect', () => {
        setConnectStatus('Reconnecting')
      })
      client.on('message', (topic, message) => {
        const messagePayload = { topic, message: message.toString(), timestamp: Date.now() }
        setNewMessage(messagePayload)
      })
    }
  }, [client])

  useEffect(() => {
    if (newMessage) {
      setMessages([...messages,newMessage])

    }
    return () => {
    }
  }, [newMessage])



  const mqttDisconnect = () => {
    if (client) {
      client.end(() => {
        setConnectStatus('Offline')
      })
    }
  }

  const mqttPublish = context => {
    if (client) {
      const { topic, qos, payload } = context
      client.publish(topic, payload, { qos }, error => {
        if (error) {
          console.log('Publish error: ', error)
        }
      })
    }
  }

  const mqttSub = subscription => {
    if (client) {
      const { topic, qos } = subscription
      if (!subs.includes(topic)) {
        client.subscribe(topic, { qos }, error => {
          if (error) {
            console.log('Subscribe to topics error', error)
            return
          }
          setIsSub(true)
        })
        setSubs([...subs, topic])
      }

    }
  }

  const mqttUnSub = subscription => {
    if (client) {
      const { topic } = subscription
      client.unsubscribe(topic, error => {
        if (error) {
          console.log('Unsubscribe error', error)
          return
        }
        setIsSub(false)
        setSubs(subs.filter(sub => sub !== topic))

      })
    }
  }

  function generateMainView() {
    switch (activeView) {
      case 'deviceSetup':
        return (
          <FCTGraphSelection
            fctGraph={fctGraph}
            setFctGraph={setFctGraph}
          />
        )
      case 'mqttSetup':
        return (
          <MQTTSelector
            mqttConnect={mqttConnect}
            mqttDisconnect={mqttDisconnect}
            connectStatus={connectStatus}
          />
        )
      case 'inputOutput':
        return (
          <Row gutter={[8, 8]}>
            <Col span={12}>
              <CommandLogs
                mqttSub={mqttSub}
                mqttUnSub={mqttUnSub}
                subs={subs}
                messages={messages}
                setMessages={setMessages}

              />
            </Col>
            <Col span={12}>
              <DataGenerator
                fctGraph={fctGraph}
                publish={mqttPublish}
              />
            </Col>
          </Row>
        )
      default:
        break
    }
    return <>Oops</>
  }

  return (
    <div className='App'>
      <Layout style={{ height: '100vh' }}>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <h1 style={{ color: 'white' }}> Dr. Frank N. Furters Sausage Factory</h1>

          <Menu
            theme='dark'
            mode='inline'
            defaultSelectedKeys={['deviceSetup']}
            onClick={({ key }) => { setActiveView(key) }}
            items={[
              {
                key: 'deviceSetup',
                label: 'Device Setup',
                icon: fctGraph ? <CheckCircleTwoTone twoToneColor='#00FF00' /> : <CloseCircleTwoTone twoToneColor='#FF0000' />,

              },
              {
                key: 'mqttSetup',
                label: `MQTT: ${connectStatus}`,
                icon: connectStatus === 'Connected' ? <CheckCircleTwoTone twoToneColor='#00FF00' /> : <CloseCircleTwoTone twoToneColor='#FF0000' />,

              },
              {
                key: 'inputOutput',
                label: 'Comms',
                icon: <UserOutlined />,

              },
            ]}
          />
        </Sider>
        <Layout className='site-layout'>
          <Header className='site-layout-background' style={{ padding: 0 }}>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
            })}
          </Header>
          <Content
            className='site-layout-background'
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
            }}
          >
            { generateMainView() }

          </Content>
        </Layout>
      </Layout>
    </div>
  )
}

export default ConnectedApp
