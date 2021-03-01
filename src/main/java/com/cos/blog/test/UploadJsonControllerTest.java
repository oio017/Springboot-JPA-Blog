package com.cos.blog.test;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

import org.json.simple.JSONObject;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UploadJsonControllerTest {

	@PostMapping("/upload/oneDaySale/{vending}")
	public String oneDaySale(@RequestBody JSONObject jsonObject, @PathVariable String vending) throws IOException {
		
		System.out.println("vending : " + vending);
		System.out.println("jsonObject : " + jsonObject);
		
		String date = (String) jsonObject.get("Date range");
		String device = (String) jsonObject.get("Device name");
		System.out.println("Date range : " + date);
		System.out.println("Device name : " + device);

		String[] DateArray = date.substring(0, ("17/02/2021".length())).split("/");
		String fileName = "../upload/" + device + "/" + DateArray[2] + DateArray[1] + DateArray[0] + "_oneDaySale.josn";
		System.out.println("fileName : " +fileName);
		
		File f = new File("../upload/" + device);
		File f1 = new File(fileName);
		if (f.exists() == false) {
			f.mkdir();
		}
		if (f1.exists() == true) {
			f1.delete();
		}
		
		FileWriter file = new FileWriter(fileName);
		file.write(jsonObject.toString());
		file.flush();
		file.close();

		return "@PostMapping";
	}
}
