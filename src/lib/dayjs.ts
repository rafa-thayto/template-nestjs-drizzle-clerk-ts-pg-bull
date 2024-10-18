import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import timezone from 'dayjs/plugin/timezone';
import dayjsBusinessTime from 'dayjs-business-time';
// import { getHolidays } from './holidays';
// import 'dayjs/locale/pt-br';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);
dayjs.extend(dayjsBusinessTime);
// dayjs.setHolidays(getHolidays(dayjs().get('year')));

// dayjs.tz.setDefault('America/Sao_Paulo');

export default dayjs;
