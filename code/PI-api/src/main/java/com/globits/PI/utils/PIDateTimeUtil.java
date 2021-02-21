package com.globits.PI.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.Date;
import java.util.List;
import java.util.ArrayList;
import java.util.Calendar;

public class PIDateTimeUtil {
	public static Date numberToDate(int day, int month, int year) throws ParseException {
		String dateString =  String.format("%02d", day) + "/" +  String.format("%02d", month) + "/" + year + " 23:59:00";
		Date date = new SimpleDateFormat("dd/MM/yyyy hh:mm:ss").parse(dateString);

		return date;
	}
	
	
	
	public static Date getLastDayOfMonth(int month, int year) {
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
		String date = "01/" + String.format("%02d", month) + "/" + year;
		LocalDate localDate = LocalDate.parse(date, formatter);
		LocalDate lastDay = localDate.with(TemporalAdjusters.lastDayOfMonth());
		
		Date lastDayOfMonth = Date.from(lastDay.atStartOfDay().atZone(ZoneId.systemDefault()).toInstant());
		
		Calendar calendar = Calendar.getInstance();
	    calendar.setTime(lastDayOfMonth);
	    calendar.set(Calendar.HOUR_OF_DAY, 23);
	    calendar.set(Calendar.MINUTE, 59);
	    calendar.set(Calendar.SECOND, 59);
	    calendar.set(Calendar.MILLISECOND, 999);
	    
		return calendar.getTime();
	}
	public static List<LocalDate> getListMonthByMonthYear(int fromMonth,int fromyear,int toMonth,int toYear){
		List<int[]> ret = new ArrayList<int[]>();
		List<LocalDate> retCalendar = new ArrayList<LocalDate>();
		
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");		
		
		LocalDate beginCalendar = LocalDate.parse("01/" + String.format("%02d", fromMonth) + "/" + fromyear,formatter);
		LocalDate finishCalendar = LocalDate.parse(getLastDayOfMonth(toMonth,toYear).getDate()+"/" + String.format("%02d", toMonth)+ "/" + toYear,formatter);     
		
        while(beginCalendar.isBefore(finishCalendar)) {        	
        	retCalendar.add(beginCalendar);
        	beginCalendar = beginCalendar.plusMonths(1L);
        }
        return retCalendar;
	}
	
	public static Date getEndOfDay(Date date) {
		if(date!=null) {
			Calendar calendar = Calendar.getInstance();
		    calendar.setTime(date);
		    calendar.set(Calendar.HOUR_OF_DAY, 23);
		    calendar.set(Calendar.MINUTE, 59);
		    calendar.set(Calendar.SECOND, 59);
		    calendar.set(Calendar.MILLISECOND, 999);
		    return calendar.getTime();
		}
	    return null;
	}
	
	public static Date getStartOfDay(Date date) {
		if(date!=null) {
			Calendar calendar = Calendar.getInstance();
		    calendar.setTime(date);
		    calendar.set(Calendar.HOUR_OF_DAY, 00);
		    calendar.set(Calendar.MINUTE, 00);
		    calendar.set(Calendar.SECOND, 00);
		    calendar.set(Calendar.MILLISECOND, 000);		    
		    return calendar.getTime();
		}
	    return null;
	}
	
	public static Date getPrevDay(Date date) {
	    Calendar calendar = Calendar.getInstance();
	    calendar.setTime(date);
	    calendar.add(Calendar.DAY_OF_MONTH, -1);
	    calendar.set(Calendar.HOUR_OF_DAY, 23);
	    calendar.set(Calendar.MINUTE, 59);
	    calendar.set(Calendar.SECOND, 59);
	    calendar.set(Calendar.MILLISECOND, 999);
	    return calendar.getTime();
	}
	
	public static Date getNextDay(Date date) {
	    Calendar calendar = Calendar.getInstance();
	    calendar.setTime(date);
	    calendar.add(Calendar.DAY_OF_MONTH, 1);
	    calendar.set(Calendar.HOUR_OF_DAY, 00);
	    calendar.set(Calendar.MINUTE, 00);
	    calendar.set(Calendar.SECOND, 00);
	    calendar.set(Calendar.MILLISECOND, 000);
	    return calendar.getTime();
	}
	
	// month from 0-> 11
		public static List<Date> getDatesInMonthJava7(int year, int month) {
			Calendar calendar = Calendar.getInstance();
	        int date = 1;
	        calendar.set(year, month, date);
			Date startDate = calendar.getTime();
			
		    List<Date> datesInRange = new ArrayList<>();
		    calendar.setTime(startDate);
		     
		    Calendar endCalendar = Calendar.getInstance();
		    int maxDay = 0;
			maxDay = calendar.getActualMaximum(Calendar.DAY_OF_MONTH);
			endCalendar.set(year, month, maxDay);
			endCalendar.add(Calendar.DATE, 1);
			Date endDate = endCalendar.getTime();
		    endCalendar.setTime(endDate);
		 
		    while (calendar.before(endCalendar)) {
		        Date result = calendar.getTime();
		        datesInRange.add(result);
		        calendar.add(Calendar.DATE, 1);
		    }
		    return datesInRange;
		}
		
		// month from 0-> 11
		public static List<Date> getDatesByYearMonth(int year, int month) {
			Calendar calendar = Calendar.getInstance();
	        int date = 1;
	        calendar.set(year, month, date);
			Date startDate = calendar.getTime();
			
		    List<Date> datesInRange = new ArrayList<>();
		    calendar.setTime(startDate);
		     
		    Calendar endCalendar = Calendar.getInstance();
		    int maxDay = 0;
			maxDay = calendar.getActualMaximum(Calendar.DAY_OF_MONTH);
			
			SimpleDateFormat simpleDateFormat = new SimpleDateFormat("MM/yyyy");
			if(simpleDateFormat.format(new Date()).equals(simpleDateFormat.format(calendar.getTime()))) {
				endCalendar = Calendar.getInstance();
			}else {
				endCalendar.set(year, month, maxDay);
			}
			endCalendar.add(Calendar.DATE, 1);
			Date endDate = endCalendar.getTime();
		    endCalendar.setTime(endDate);
		 
		    while (calendar.before(endCalendar)) {
		        Date result = calendar.getTime();
		        datesInRange.add(result);
		        calendar.add(Calendar.DATE, 1);
		    }
		    return datesInRange;
		}
}
