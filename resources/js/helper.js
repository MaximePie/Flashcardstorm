import moment from 'moment'

export default function toLocale(date) {
  return moment(date).format('Do MMMM YYYY')
}