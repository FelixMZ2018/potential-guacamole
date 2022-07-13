import moment from 'moment'

const secondsPerMinute = 60
const secondsPerHour = 3600
const secondsPerDay = 86400

export default class Time {

  static secondsToTimeUnitConversions = {
    d: seconds => seconds * secondsPerDay,
    h: seconds => seconds * secondsPerHour,
    m: seconds => seconds * secondsPerMinute,
    s: seconds => seconds,
  }

  static deriveTimeDisplayFormat(seconds) {
    if (seconds <= secondsPerMinute) { return 's[s]' }
    if (seconds <= secondsPerHour) { return 'm:ss' }
    if (seconds <= secondsPerDay) { return 'H:mm:ss' }

    return 'HH:mm:ss'
  }

  static processTimeAxisLabelFormat(durationInSeconds, derivedTimeDisplayFormat) {
    const ms = durationInSeconds * 1000
    const days = Math.floor(durationInSeconds / secondsPerDay)
    const displayFormat = (days > 0)
      ? `[${days}d ]${derivedTimeDisplayFormat}`
      : derivedTimeDisplayFormat
    if (ms < 0) return moment.utc(0).format(displayFormat)
    return moment.utc(ms).format(displayFormat)
  }

  static dateTimeAxisLabelFormat(durationInSeconds) {
    const ms = durationInSeconds * 1000
    return moment.utc(ms).local().format('Do MMM HH:mm')
  }

  static validateNumber(number) {
    if (number === 0 || number === '0') return
    if (!number || isNaN(number.toString())) {
      throw new Error(`argument: ${number} is not a valid second value`)
    }
  }

  static forceDoubleDigits(integer) {
    return integer < 10 ? `0${integer}` : integer // 7 -> 07
  }

  static getDisplayDay(msSinceEpoch) {
    const date = new Date(msSinceEpoch)
    return `${date.getMonth() + 1}/${date.getDate()}` // 8/26
  }

  static getDisplayTime(msSinceEpoch) {
    const date = new Date(msSinceEpoch)
    return `${this.forceDoubleDigits(date.getHours())}:${this.forceDoubleDigits(date.getMinutes())}` // 14:08
  }

  static getDisplayableDaysHoursMinutesSeconds(ms) {
    const { days, hours, minutes, seconds } = this.parseTimeElapsedFromMS(ms)
    return {
      days,
      hours,
      minutes: this.forceDoubleDigits(minutes),
      seconds: this.forceDoubleDigits(seconds),
    }
  }

  static parseTimeElapsedFromSeconds(seconds) {
    this.validateNumber(seconds)

    return {
      days: Math.floor(seconds / 86400),
      hours: Math.floor((seconds % 86400) / 3600),
      minutes: Math.floor((seconds % 3600) / 60),
      seconds: Math.floor(seconds % 60),
    }
  }

  static parseTimeElapsedFromMS(ms) {
    this.validateNumber(ms)
    return this.parseTimeElapsedFromSeconds(ms / 1000)
  }

  static timeToSeconds(value, unit) {

    if (!(unit in this.secondsToTimeUnitConversions)) throw new Error(`Unknown unit ${unit} provided.`)

    return this.secondsToTimeUnitConversions[unit](value)
  }

  static durationToSeconds(duration) {
    return this.timeToSeconds(duration.days, 'd')
      + this.timeToSeconds(duration.hours, 'h')
      + this.timeToSeconds(duration.minutes, 'm')
      + this.timeToSeconds(duration.seconds, 's')
  }

  static stringFromDuration(duration, trim = true, zeroValue = '0s') {

    if (duration < 0) {
      return 'Negative duration calculated. Is your computer\'s time synchronized?'
    }

    if (duration === 0) return zeroValue

    const durationObj = this.parseTimeElapsedFromSeconds(duration)
    const durationString = `${durationObj.days}d ${durationObj.hours}h ${durationObj.minutes}m ${durationObj.seconds}s`

    if (trim) {
      return durationString.replace(/^(0[dhms]\s){1,3}/g, '')
    }

    return durationString
  }

  static getTrimmedDateString(msSinceEpoch) {
    return (new Date(msSinceEpoch)).toString().substr(0, 24)
  }

  static getTrimmedDateAndTimeString(msSinceEpoch, includeSeconds = true) {
    const endIndex = includeSeconds ? 20 : 17
    return (new Date(msSinceEpoch)).toString().substr(4, endIndex)
  }

  static appendZeroToSingleDigit(digit) {
    return Number(digit.length === 1 ? `0${digit}` : digit)
  }

  static parseSecondsToLabelFormat = seconds => {
    if (seconds === '') return seconds
    const derivedTimeDisplayFormat = this.deriveTimeDisplayFormat(seconds)
    return this.processTimeAxisLabelFormat(seconds, derivedTimeDisplayFormat)
  }

  static getEndOfDay(date) {
    return new Date(date.setHours(23, 59, 59, 999))
  }

  static getStartOfDay(date) {
    return new Date(date.setHours(0, 0, 0, 0))
  }
}
