import React from 'react'
import { Table } from 'semantic-ui-react'

const renderCell = text => (
  <Table.HeaderCell key={text}>
    {text}
  </Table.HeaderCell>
)

const TableHeader = ({ items }) => (
  <Table.Header>
    <Table.Row>
      {items.map(renderCell)}
    </Table.Row>
  </Table.Header>
)

export default TableHeader
