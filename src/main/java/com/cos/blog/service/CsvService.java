package com.cos.blog.service;


import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.stereotype.Service;

@Service 
public class CsvService {
	public JSONObject csvFileToJsonObject() throws IOException {
		String target_file = "../upload/test.csv";
		JSONObject jsonObject = new JSONObject();

		List<List<String>> records = new ArrayList<>();
		try (BufferedReader br = new BufferedReader(new FileReader(target_file))) {
			String line;
			while ((line = br.readLine()) != null) {
				String[] values = line.split(",");
				records.add(Arrays.asList(values));
			}
		}

		// System.out.println(records);
		
		jsonObject = csvToJson(records);
		System.out.println("jsonObject : " + jsonObject);
		
		return jsonObject;
	}

	@SuppressWarnings("unchecked")
	public static JSONObject csvToJson(List<List<String>> wholeCsv) {
		boolean isPayInfo = false;
		int cnt = wholeCsv.size();
		JSONArray payInfoArray = new JSONArray();
		JSONArray slotInfoArray = new JSONArray();
		JSONObject jsonObject = new JSONObject();
		JSONArray saleCntInfoArray = new JSONArray();
		
		int[] initCnt = { 1, 2, 3, 4, 5, 11, 12, 13, 14, 15, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49 , 50};
		for(int val : initCnt) {
			slotInfoArray.add(val);
		}
		jsonObject.put("slotInfoArray", slotInfoArray);
		jsonObject.put("saleCntInfo", saleCntInfoArray);
		//System.out.println("saleCntInfoArray : " + saleCntInfoArray);

		for (int x = 0; x < cnt; x++) {
			List<String> csv = wholeCsv.get(x);
			// csv.removeIf(e -> e.trim().isEmpty());
			
			// 1개 이하의 value이면  모든 구매정보를 다 스캔한것으로 간주함.
			if (csv.size() <= 1) {
				System.out.println("continue : " + csv);
				isPayInfo = false;
				continue;
			}

			// get first line = columns names
			String[] columns = csv.get(0).split(",");
			if (columns[0].contains("Order Id") == true) {
				System.out.println("skip  :  the first line");
				isPayInfo = true;
				continue;
			} else if (columns[0].equals("Total")) {
				makeTotalInfo(csv, columns, jsonObject);
			} else if (columns[0].equals("Device name") || columns[0].equals("Merchant code")
					|| columns[0].equals("Date range")) {
				makeSingleValue(csv, columns, jsonObject);
				System.out.println(csv);
			}
			else if (isPayInfo == true) {
				JSONObject eachPayObj = new JSONObject();
				eachPayObj = makePayInfo(csv, columns);
				payInfoArray.add(eachPayObj);
			} else {
				System.out.println("Else Row : " + csv);
			}
		}

		System.out.println("payInfoArray : " + payInfoArray);
		jsonObject.put("payInfoArray", payInfoArray);

		return jsonObject;
	}

	@SuppressWarnings("unchecked")
	public static void makeSingleValue(List<String> csv, String[] column, JSONObject jsonObject) {
		csv.subList(0, csv.size()) // substring without first row(columns)
				.stream().map(e -> e.split(",")).filter(e -> e[0].length() > 0 && csv.indexOf(e[0]) > 0)
				.forEach(row -> {
					
					if (column[0].equals("Device name")) {
						jsonObject.put("Devicename", row[0]);
					}
					else if (column[0].equals("Merchant code")) {
						jsonObject.put("Merchantcode", row[0]);
					}
					else if (column[0].equals("Date range")) {
						jsonObject.put("Daterange", row[0]);
					}
					else {
						System.out.println("Naver be here: " + row[0]);
					}
				});
	}

	@SuppressWarnings("unchecked")
	public static void makeTotalInfo(List<String> csv, String[] column, JSONObject jsonObject) {
		JSONArray payInfoArray = (JSONArray) jsonObject.get("saleCntInfo");

		csv.subList(0, csv.size()) // substring without first row(columns)
				.stream().map(e -> e.split(",")).filter(e -> e[0].length() > 0 && e[0].equals("Total") == false)
				.forEach(row -> {
					// int index = csv.indexOf(row[0]);
					int kind = (int) jsonObject.getOrDefault("TotalAmount", -1);
					if (kind == -1) {
						jsonObject.put("TotalAmount", Integer.parseInt(row[0]));
					}
					else {
						kind = (int) jsonObject.getOrDefault("TotalRealAmount", -1);
						if (kind == -1) {
							jsonObject.put("TotalRealAmount", Integer.parseInt(row[0]));
						}
						else {
							kind = (int) jsonObject.getOrDefault("TotalRufudAmount", -1);
							if (kind == -1) {
								jsonObject.put("TotalRufudAmount", Integer.parseInt(row[0]));
							}
						}
					}
					
					if (kind != -1) {
						payInfoArray.add(Integer.parseInt(row[0]));
					}
				});
	}

	@SuppressWarnings("unchecked")
	public static JSONObject makePayInfo(List<String> csv, String[] column) {
		JSONObject eachPayObj = new JSONObject();

		csv.subList(0, csv.size()) // substring without first row(columns)
				.stream().map(e -> e.split(","))
				.forEach(row -> {
					int index = eachPayObj.size();
					switch (index) {
					case 0:
						eachPayObj.put("OrderId", row[0]);
						break;
					case 1:
						eachPayObj.put("TransactionId", row[0]);
						break;
					case 2:
						eachPayObj.put("Date", row[0]);
						break;
					case 3:
						eachPayObj.put("Method", row[0]);
						break;
					case 4:
						eachPayObj.put("TotalAmount", Integer.parseInt(row[0]));
						break;
					case 5:
						eachPayObj.put("SuccessAmount", Integer.parseInt(row[0]));
						break;
					case 6:
						eachPayObj.put("RefundAmount", Integer.parseInt(row[0]));
						break;
					case 7:
						eachPayObj.put("RefundStatus", row[0]);
						break;
					case 8:
						eachPayObj.put("RefundDesc", row[0]);
						break;
					case 9:
						eachPayObj.put("SuccessSlots", row[0]);
						break;
					case 10:
						eachPayObj.put("JamSlots", row[0]);
						break;
					default:
						//TODO : 결재별 판매된 슬롯 상품정보 Array 로 넣을것.
						//System.out.println("Slot Info for each pay: " + row[0]);
						break;
					}
				});
		return eachPayObj;
	}
}
