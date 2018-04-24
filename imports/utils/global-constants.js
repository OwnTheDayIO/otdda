
export const APP_NAME             = 'Own The Day';
export const APP_VERSION          = 'v1.6.0';

export const CONTRACT_ADDRESS = {
    '1'    : '0x16d790ad4e33725d44741251f100e635c323beb9', // Main
    '3'    : '0x7c28cD4F02597f598B2811b0637F141ba1400788', // Ropsten
    '5777' : '0x345ca3e014aaf5dca488057592ee47305d9b3e10'  // Ganache
};

export const TOTAL_DAYS = 366;

export const ACCOUNT_WATCH_INTERVAL = 1000;
export const RECEIPT_WATCH_INTERVAL = 1000;
export const PRICE_WATCH_INTERVAL   = 5000;

export const MAX_LEADER_COUNT = 3;

export const MONTH_INDICES    = [ 0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11];
export const DAYS_IN_MONTH    = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export const ADDRESS_DISPLAY_LENGTH = 12;

export const HOLIDAY_ICON_MAP = [
    {dayIndex: 0,    classname: 'jan1',  img: '/img/holidays/jan1.svg',  title: 'holiday.jan1.title',  desc: 'holiday.jan1.desc'},
    {dayIndex: 5,    classname: 'jan6',  img: '/img/holidays/jan6.svg',  title: 'holiday.jan6.title',  desc: 'holiday.jan6.desc'},
    {dayIndex: 6,    classname: 'jan7',  img: '/img/holidays/jan7.svg',  title: 'holiday.jan7.title',  desc: 'holiday.jan7.desc'},
    {dayIndex: 13,   classname: 'jan14',  img: '/img/holidays/jan14.svg',  title: 'holiday.jan14.title',  desc: 'holiday.jan14.desc'},
    {dayIndex: 14,   classname: 'jan15',  img: '/img/holidays/jan15.svg',  title: 'holiday.jan15.title',  desc: 'holiday.jan15.desc'},
    {dayIndex: 29,   classname: 'jan30',  img: '/img/holidays/jan30.svg',  title: 'holiday.jan30.title',  desc: 'holiday.jan30.desc'},
    {dayIndex: 31,   classname: 'feb1',  img: '/img/holidays/feb1.svg',  title: 'holiday.feb1.title',  desc: 'holiday.feb1.desc'},
    {dayIndex: 32,   classname: 'feb2',  img: '/img/holidays/feb2.svg',  title: 'holiday.feb2.title',  desc: 'holiday.feb2.desc'},
    {dayIndex: 42,   classname: 'feb12',  img: '/img/holidays/feb12.svg',  title: 'holiday.feb12.title',  desc: 'holiday.feb12.desc'},
    {dayIndex: 43,   classname: 'feb13',  img: '/img/holidays/feb13.svg',  title: 'holiday.feb13.title',  desc: 'holiday.feb13.desc'},
    {dayIndex: 44,   classname: 'feb14',  img: '/img/holidays/feb14.svg',  title: 'holiday.feb14.title',  desc: 'holiday.feb14.desc'},
    {dayIndex: 46,   classname: 'feb16',  img: '/img/holidays/feb16.svg',  title: 'holiday.feb16.title',  desc: 'holiday.feb16.desc'},
    {dayIndex: 60,   classname: 'mar1',  img: '/img/holidays/mar1.svg',  title: 'holiday.mar1.title',  desc: 'holiday.mar1.desc'},
    {dayIndex: 61,   classname: 'mar2',  img: '/img/holidays/mar2.svg',  title: 'holiday.mar2.title',  desc: 'holiday.mar2.desc'},
    {dayIndex: 76,   classname: 'mar17',  img: '/img/holidays/mar17.svg',  title: 'holiday.mar17.title',  desc: 'holiday.mar17.desc'},
    {dayIndex: 79,   classname: 'mar20',  img: '/img/holidays/mar20.svg',  title: 'holiday.mar20.title',  desc: 'holiday.mar20.desc'},
    {dayIndex: 84,   classname: 'mar25',  img: '/img/holidays/mar25.svg',  title: 'holiday.mar25.title',  desc: 'holiday.mar25.desc'},
    {dayIndex: 89,   classname: 'mar30',  img: '/img/holidays/mar30.svg',  title: 'holiday.mar30.title',  desc: 'holiday.mar30.desc'},
    {dayIndex: 91,   classname: 'apr1',  img: '/img/holidays/apr1.svg',  title: 'holiday.apr1.title',  desc: 'holiday.apr1.desc'},
    {dayIndex: 92,   classname: 'apr2',  img: '/img/holidays/apr2.svg',  title: 'holiday.apr2.title',  desc: 'holiday.apr2.desc'},
    {dayIndex: 96,   classname: 'apr6',  img: '/img/holidays/apr6.svg',  title: 'holiday.apr6.title',  desc: 'holiday.apr6.desc'},
    {dayIndex: 98,   classname: 'apr8',  img: '/img/holidays/apr8.svg',  title: 'holiday.apr8.title',  desc: 'holiday.apr8.desc'},
    {dayIndex: 101,  classname: 'apr11',  img: '/img/holidays/apr11.svg',  title: 'holiday.apr11.title',  desc: 'holiday.apr11.desc'},
    {dayIndex: 102,  classname: 'apr12',  img: '/img/holidays/apr12.svg',  title: 'holiday.apr12.title',  desc: 'holiday.apr12.desc'},
    {dayIndex: 107,  classname: 'apr17',  img: '/img/holidays/apr17.svg',  title: 'holiday.apr17.title',  desc: 'holiday.apr17.desc'},
    {dayIndex: 112,  classname: 'apr22',  img: '/img/holidays/apr22.svg',  title: 'holiday.apr22.title',  desc: 'holiday.apr22.desc'},
    {dayIndex: 116,  classname: 'apr26',  img: '/img/holidays/apr26.svg',  title: 'holiday.apr26.title',  desc: 'holiday.apr26.desc'},
    {dayIndex: 117,  classname: 'apr27',  img: '/img/holidays/apr27.svg',  title: 'holiday.apr27.title',  desc: 'holiday.apr27.desc'},
    {dayIndex: 122,  classname: 'may2',  img: '/img/holidays/may2.svg',  title: 'holiday.may2.title',  desc: 'holiday.may2.desc'},
    {dayIndex: 124,  classname: 'may4',  img: '/img/holidays/may4.svg',  title: 'holiday.may4.title',  desc: 'holiday.may4.desc'},
    {dayIndex: 125,  classname: 'may5',  img: '/img/holidays/may5.svg',  title: 'holiday.may5.title',  desc: 'holiday.may5.desc'},
    {dayIndex: 126,  classname: 'may6',  img: '/img/holidays/may6.svg',  title: 'holiday.may6.title',  desc: 'holiday.may6.desc'},
    {dayIndex: 130,  classname: 'may10',  img: '/img/holidays/may10.svg',  title: 'holiday.may10.title',  desc: 'holiday.may10.desc'},
    {dayIndex: 133,  classname: 'may13',  img: '/img/holidays/may13.svg',  title: 'holiday.may13.title',  desc: 'holiday.may13.desc'},
    {dayIndex: 135,  classname: 'may15',  img: '/img/holidays/may15.svg',  title: 'holiday.may15.title',  desc: 'holiday.may15.desc'},
    {dayIndex: 139,  classname: 'may19',  img: '/img/holidays/may19.svg',  title: 'holiday.may19.title',  desc: 'holiday.may19.desc'},
    {dayIndex: 140,  classname: 'may20',  img: '/img/holidays/may20.svg',  title: 'holiday.may20.title',  desc: 'holiday.may20.desc'},
    {dayIndex: 141,  classname: 'may21',  img: '/img/holidays/may21.svg',  title: 'holiday.may21.title',  desc: 'holiday.may21.desc'},
    {dayIndex: 148,  classname: 'may28',  img: '/img/holidays/may28.svg',  title: 'holiday.may28.title',  desc: 'holiday.may28.desc'},
    {dayIndex: 151,  classname: 'may31',  img: '/img/holidays/may31.svg',  title: 'holiday.may31.title',  desc: 'holiday.may31.desc'},
    {dayIndex: 157,  classname: 'jun6',  img: '/img/holidays/jun6.svg',  title: 'holiday.jun6.title',  desc: 'holiday.jun6.desc'},
    {dayIndex: 161,  classname: 'jun10',  img: '/img/holidays/jun10.svg',  title: 'holiday.jun10.title',  desc: 'holiday.jun10.desc'},
    {dayIndex: 165,  classname: 'jun14',  img: '/img/holidays/jun14.svg',  title: 'holiday.jun14.title',  desc: 'holiday.jun14.desc'},
    {dayIndex: 168,  classname: 'jun17',  img: '/img/holidays/jun17.svg',  title: 'holiday.jun17.title',  desc: 'holiday.jun17.desc'},
    {dayIndex: 172,  classname: 'jun21',  img: '/img/holidays/jun21.svg',  title: 'holiday.jun21.title',  desc: 'holiday.jun21.desc'},
    {dayIndex: 182,  classname: 'jul1',  img: '/img/holidays/jul1.svg',  title: 'holiday.jul1.title',  desc: 'holiday.jul1.desc'},
    {dayIndex: 185,  classname: 'jul4',  img: '/img/holidays/jul4.svg',  title: 'holiday.jul4.title',  desc: 'holiday.jul4.desc'},
    {dayIndex: 195,  classname: 'jul14',  img: '/img/holidays/jul14.svg',  title: 'holiday.jul14.title',  desc: 'holiday.jul14.desc'},
    {dayIndex: 202,  classname: 'jul21',  img: '/img/holidays/jul21.svg',  title: 'holiday.jul21.title',  desc: 'holiday.jul21.desc'},
    {dayIndex: 203,  classname: 'jul22',  img: '/img/holidays/jul22.svg',  title: 'holiday.jul22.title',  desc: 'holiday.jul22.desc'},
    {dayIndex: 217,  classname: 'aug5',  img: '/img/holidays/aug5.svg',  title: 'holiday.aug5.title',  desc: 'holiday.aug5.desc'},
    {dayIndex: 227,  classname: 'aug15',  img: '/img/holidays/aug15.svg',  title: 'holiday.aug15.title',  desc: 'holiday.aug15.desc'},
    {dayIndex: 231,  classname: 'aug19',  img: '/img/holidays/aug19.svg',  title: 'holiday.aug19.title',  desc: 'holiday.aug19.desc'},
    {dayIndex: 232,  classname: 'aug20',  img: '/img/holidays/aug20.svg',  title: 'holiday.aug20.title',  desc: 'holiday.aug20.desc'},
    {dayIndex: 237,  classname: 'aug25',  img: '/img/holidays/aug25.svg',  title: 'holiday.aug25.title',  desc: 'holiday.aug25.desc'},
    {dayIndex: 238,  classname: 'aug26',  img: '/img/holidays/aug26.svg',  title: 'holiday.aug26.title',  desc: 'holiday.aug26.desc'},
    {dayIndex: 245,  classname: 'sept2',  img: '/img/holidays/sept2.svg',  title: 'holiday.sept2.title',  desc: 'holiday.sept2.desc'},
    {dayIndex: 255,  classname: 'sept12',  img: '/img/holidays/sept12.svg',  title: 'holiday.sept12.title',  desc: 'holiday.sept12.desc'},
    {dayIndex: 261,  classname: 'sept18',  img: '/img/holidays/sept18.svg',  title: 'holiday.sept18.title',  desc: 'holiday.sept18.desc'},
    {dayIndex: 263,  classname: 'sept20',  img: '/img/holidays/sept20.svg',  title: 'holiday.sept20.title',  desc: 'holiday.sept20.desc'},
    {dayIndex: 265,  classname: 'sept22',  img: '/img/holidays/sept22.svg',  title: 'holiday.sept22.title',  desc: 'holiday.sept22.desc'},
    {dayIndex: 266,  classname: 'sept23',  img: '/img/holidays/sept23.svg',  title: 'holiday.sept23.title',  desc: 'holiday.sept23.desc'},
    {dayIndex: 273,  classname: 'sept30',  img: '/img/holidays/sept30.svg',  title: 'holiday.sept30.title',  desc: 'holiday.sept30.desc'},
    {dayIndex: 274,  classname: 'oct1',  img: '/img/holidays/oct1.svg',  title: 'holiday.oct1.title',  desc: 'holiday.oct1.desc'},
    {dayIndex: 281,  classname: 'oct8',  img: '/img/holidays/oct8.svg',  title: 'holiday.oct8.title',  desc: 'holiday.oct8.desc'},
    {dayIndex: 282,  classname: 'oct9',  img: '/img/holidays/oct9.svg',  title: 'holiday.oct9.title',  desc: 'holiday.oct9.desc'},
    {dayIndex: 291,  classname: 'oct18',  img: '/img/holidays/oct18.svg',  title: 'holiday.oct18.title',  desc: 'holiday.oct18.desc'},
    {dayIndex: 304,  classname: 'oct31',  img: '/img/holidays/oct31.svg',  title: 'holiday.oct31.title',  desc: 'holiday.oct31.desc'},
    {dayIndex: 305,  classname: 'nov1',  img: '/img/holidays/nov1.svg',  title: 'holiday.nov1.title',  desc: 'holiday.nov1.desc'},
    {dayIndex: 306,  classname: 'nov2',  img: '/img/holidays/nov2.svg',  title: 'holiday.nov2.title',  desc: 'holiday.nov2.desc'},
    {dayIndex: 311,  classname: 'nov7',  img: '/img/holidays/nov7.svg',  title: 'holiday.nov7.title',  desc: 'holiday.nov7.desc'},
    {dayIndex: 315,  classname: 'nov11',  img: '/img/holidays/nov11.svg',  title: 'holiday.nov11.title',  desc: 'holiday.nov11.desc'},
    {dayIndex: 324,  classname: 'nov20',  img: '/img/holidays/nov20.svg',  title: 'holiday.nov20.title',  desc: 'holiday.nov20.desc'},
    {dayIndex: 326,  classname: 'nov22',  img: '/img/holidays/nov22.svg',  title: 'holiday.nov22.title',  desc: 'holiday.nov22.desc'},
    {dayIndex: 336,  classname: 'dec2',  img: '/img/holidays/dec2.svg',  title: 'holiday.dec2.title',  desc: 'holiday.dec2.desc'},
    {dayIndex: 355,  classname: 'dec21',  img: '/img/holidays/dec21.svg',  title: 'holiday.dec21.title',  desc: 'holiday.dec21.desc'},
    {dayIndex: 358,  classname: 'dec24',  img: '/img/holidays/dec24.svg',  title: 'holiday.dec24.title',  desc: 'holiday.dec24.desc'},
    {dayIndex: 359,  classname: 'dec25',  img: '/img/holidays/dec25.svg',  title: 'holiday.dec25.title',  desc: 'holiday.dec25.desc'},
    {dayIndex: 365,  classname: 'dec31',  img: '/img/holidays/dec31.svg',  title: 'holiday.dec31.title',  desc: 'holiday.dec31.desc'}
];
