package com.globits.core.sys;

public class CoreSysConst {
	public static enum ConceptDataType{
		coded(0),//Concept 
		booleans(1),//True-False
		datetimes(2),//Date
		numeric(3),//numeric
		text(4)//text
		;		
		private Integer value;
		private ConceptDataType(int value) {
		    this.value = value;
		}
	
		public Integer getValue() {
			return value;
		}
	}
}
