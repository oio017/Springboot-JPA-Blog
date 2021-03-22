package com.cos.blog.util;

import java.util.ArrayList;

import org.json.simple.JSONArray;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.stereotype.Component;

import com.cos.blog.model.OrderItem;

@Component
public class DataConvert {

	public enum EntityType {
		SALE, MOTOR, JAM, ACCOUNT
	}
	
	public enum PaymentType {
		FREE, VIETEELPAY
	}
	
	
	JSONArray saleCntPerSlotJsonArray = null;
	JSONArray motorErrorCntPerSlotJsonArray = null;
	JSONArray jamCntPerSlotJsonArray = null;
	JSONArray accountPerSlotJsonArray = null;
	
	ArrayList<Integer> saleCntPerSlotList = null;
	ArrayList<Integer> motorErrorCntPerSlotList = null;
	ArrayList<Integer> jamCntPerSlotList = null;
	ArrayList<Integer> accountPerSlotList = null;
	
	
	
	// String [1, 2,3,4,5,.... ] --> ArrayList<ArrayList<Integer>> [[1, 2, 3, 4, 5], [11, 12, 13, 14, 15], [21, .... 30] .. [51, 52 ... 60]]
	public ArrayList<ArrayList<Integer>> makeRowColumnSlotName(String StringSlots){
		System.out.println("slotName : " + StringSlots);
		JSONParser parser = new JSONParser();
		JSONArray jsonArray = null;
		try {
			jsonArray = (JSONArray)parser.parse(StringSlots);
		} catch (ParseException e) {
			e.printStackTrace();
		}			
		System.out.println("jsonArray : " + jsonArray);
		ArrayList<ArrayList<Integer>> arrayList = new ArrayList<ArrayList<Integer>>();
		int cnt = 0;
		int totalCnt = 0;
		for(int row = 0; row < 6; row++) {
			arrayList.add(new ArrayList<Integer>());
			if (row < 2)
				cnt = 5;
			else
				cnt = 10;
			for(int col = 0; col < cnt; col++) {
				int value = Integer.parseInt(String.valueOf(jsonArray.get(totalCnt++)));
				arrayList.get(row).add((Integer)value);
			}
		}
		
		System.out.println("arrayList : " + arrayList.toString());
		
		return arrayList;
	}
	
	// String [1, 2,3,4,5,.... ] --> ArrayList<ArrayList<Integer>> [1, 2, 3, 4, 5, 11, 12, 13, 14, 15, 21, .... 30, 51, 52 ... 60]
	public ArrayList<Integer> makeRowColumnSlotName1(String StringSlots){
		JSONParser parser = new JSONParser();
		JSONArray jsonArray = null;
		try {
			jsonArray = (JSONArray)parser.parse(StringSlots);
		} catch (ParseException e) {
			e.printStackTrace();
		}			
		System.out.println("jsonArray : " + jsonArray);
		ArrayList<Integer> arrayList = new ArrayList<Integer>();
		for(int row = 0; row < 50; row++) {
				int value = Integer.parseInt(String.valueOf(jsonArray.get(row)));
				arrayList.add((Integer)value);
		}
		return arrayList;
	}
	

	public void addCntPerSlot(EntityType type, String slotNames, int slotId, int quantity) {
		
		JSONArray cntPerSlotJsonArray = null;
		ArrayList<Integer> cntPerSlotList = null;
		if (type == EntityType.SALE) {
			cntPerSlotJsonArray = saleCntPerSlotJsonArray;	
			cntPerSlotList = saleCntPerSlotList;
		}
		else if (type == EntityType.MOTOR) {
			cntPerSlotJsonArray = motorErrorCntPerSlotJsonArray;	
			cntPerSlotList = motorErrorCntPerSlotList;
		}
		else if (type == EntityType.JAM) {
			cntPerSlotJsonArray = jamCntPerSlotJsonArray;	
			cntPerSlotList = jamCntPerSlotList;
		}
		else if(type == EntityType.ACCOUNT) {
			cntPerSlotJsonArray = accountPerSlotJsonArray;	
			cntPerSlotList = accountPerSlotList;
		}
		
		JSONParser parser = new JSONParser();
		if (cntPerSlotJsonArray == null) {
			try {
				System.out.println("slotNames: " + slotNames);
				cntPerSlotJsonArray = (JSONArray)parser.parse(slotNames);
				System.out.println(type.toString() + "_cntPerSlotJsonArray: " + cntPerSlotJsonArray.toJSONString());
			} catch (ParseException e) {
				e.printStackTrace();
			}			
		}

		System.out.println("slotId: " + slotId);
		int size = cntPerSlotJsonArray.size();
		
		int index = -1;
		for(int i = 0; i < size; i++) {
			if ( cntPerSlotJsonArray.get(i).toString().equals(Integer.toString(slotId)) )
				index = i;
		}
		
		System.out.println("index: " + index);
		System.out.println("size: " + size);
		
		if (cntPerSlotList == null) {
			cntPerSlotList = new ArrayList<Integer>();
			for(int i = 0; i < size; i++)
				cntPerSlotList.add(0);
		}
		int value = cntPerSlotList.get(index) + quantity;
		System.out.println("value: " + value);
		cntPerSlotList.add(index, value); 
		
		System.out.println(type.toString() + "_cntPerSlotList: " + cntPerSlotList.toString());
		
		if (type == EntityType.SALE) {
			saleCntPerSlotJsonArray = cntPerSlotJsonArray;	
			saleCntPerSlotList = cntPerSlotList;
		}
		else if (type == EntityType.MOTOR) {
			motorErrorCntPerSlotJsonArray = cntPerSlotJsonArray;	
			motorErrorCntPerSlotList = cntPerSlotList;
		}
		else if (type == EntityType.JAM) {
			jamCntPerSlotJsonArray = cntPerSlotJsonArray;	
			jamCntPerSlotList = cntPerSlotList;
		}
	}
	
	public String getCntPerSlot(EntityType type) {
		String cntPerSlot = null;
		StringBuilder sb = new StringBuilder();
		ArrayList<Integer> cntPerSlotList = null;

		if (type == EntityType.SALE) {	
			cntPerSlotList = saleCntPerSlotList;
		}
		else if (type == EntityType.MOTOR) {	
			cntPerSlotList = motorErrorCntPerSlotList;
		}
		else if (type == EntityType.JAM) {	
			cntPerSlotList = jamCntPerSlotList;
		}
		
		System.out.println(type.toString() + "_cntPerSlotList : " + cntPerSlotList.toString());
		int value;
		int size = cntPerSlotList.size();
		sb.append("[");
		for(int i = 0; i < size; i++) {
			value = cntPerSlotList.get(i);
			if (i == (size-1))
				sb.append(value);
			else
				sb.append(value + ", ");
		}
		sb.append("]");
		cntPerSlot = sb.toString();
		System.out.println(type.toString() + "_cntPerSlot : " + cntPerSlot);
		
		return cntPerSlot;
	}
	
	public void addMoneyPerSlot(EntityType type, String slotNames, int method, OrderItem orderItem) {
		int slotId = orderItem.getSlotId();
		JSONArray whatPerSlotJsonArray = null;
		ArrayList<Integer> whatPerSlotList = null;
		if(type == EntityType.ACCOUNT) {
			whatPerSlotJsonArray = accountPerSlotJsonArray;	
			whatPerSlotList = accountPerSlotList;
		}
		
		JSONParser parser = new JSONParser();
		if (whatPerSlotJsonArray == null) {
			try {
				System.out.println("slotNames: " + slotNames);
				whatPerSlotJsonArray = (JSONArray)parser.parse(slotNames);
				System.out.println(type + "accountPerSlotJsonArray: " + accountPerSlotJsonArray.toJSONString());
			} catch (ParseException e) {
				e.printStackTrace();
			}			
		}

		System.out.println("slotId: " + slotId);
		int size = whatPerSlotJsonArray.size();
		
		int index = -1;
		for(int i = 0; i < size; i++) {
			if ( whatPerSlotJsonArray.get(i).toString().equals(Integer.toString(slotId)) )
				index = i;
		}
		
		System.out.println("index: " + index);
		System.out.println("size: " + size);
		
		if (whatPerSlotList == null) {
			whatPerSlotList = new ArrayList<Integer>();
			for(int i = 0; i < size; i++)
				whatPerSlotList.add(0);
		}
		
		if (method != PaymentType.FREE.ordinal()) {
			int quantity = orderItem.getQuantity();
			int price = orderItem.getUnitPrice();
			int dispensingFailItems = orderItem.getDispensingFailItems();
			int value = whatPerSlotList.get(index) + price*(quantity - dispensingFailItems);
			System.out.println("value: " + value);
			whatPerSlotList.add(index, value);			
		}
		
		System.out.println(type.toString() + "_acccountPerSlotList: " + whatPerSlotList.toString());
		
		if (type == EntityType.SALE) {
			accountPerSlotJsonArray = whatPerSlotJsonArray;	
			saleCntPerSlotList = whatPerSlotList;
		}
	}
	
	public String getWhatPerSlot(PaymentType type) {
		String whatPerSlot = null;
		StringBuilder sb = new StringBuilder();
		ArrayList<Integer> whatPerSlotList = null;

		if (type == PaymentType.VIETEELPAY) {	
			whatPerSlotList = accountPerSlotList;
		}
		
		System.out.println(type.toString() + "_whatPerSlotList : " + whatPerSlotList.toString());
		int value;
		int size = whatPerSlotList.size();
		sb.append("[");
		for(int i = 0; i < size; i++) {
			value = whatPerSlotList.get(i);
			if (i == (size-1))
				sb.append(value);
			else
				sb.append(value + ", ");
		}
		sb.append("]");
		whatPerSlot = sb.toString();
		System.out.println(type.toString() + "_PerSlotList : " + whatPerSlot);
		
		return whatPerSlot;
	}
	

	
}
