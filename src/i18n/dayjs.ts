import 'dayjs/locale/en';

import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(timezone);
dayjs.extend(isToday);
// default using en
dayjs.locale('en');
