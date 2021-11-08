/***
* @description Test class for the sfpegForceDML_CTL class.
* @author      P-E GROS
* @date        Dec. 2020
* @see         sfpegForceDML_CTL
*
* Legal Notice
* 
* MIT License
* 
* Copyright (c) 2020 pegros
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
***/

@isTest
public class  sfpegForceDML_CTL_TST {
    
/***
* @description Initializes the test context.
***/
    @testSetup
    static void testSetup() {
        System.debug('testSetup: START');

        System.debug('testSetup: END');
    }


/***
* @description Tests the "executeDML" method.
***/
    
    static TestMethod void testExecuteDML() {
        System.debug('testExecuteDMLs: START'); 
        Test.startTest();
        
        Task newTask = new Task(Subject = 'Test', Status = 'En cours', ActivityDate = date.newinstance(2021,01,01));
        Task newTask2 = new Task(Subject = 'Test2', Status = 'En cours', ActivityDate = date.newinstance(2021,01,02));
        sfpegForceDML_CTL.DmlRequest newRequest = new sfpegForceDML_CTL.DmlRequest();
        newRequest.record = newTask;
        newRequest.operation = 'insert';
        list<sfpegForceDML_CTL.DmlRequest> requestList = new list<sfpegForceDML_CTL.DmlRequest>();
        requestList.add(newRequest);
        System.debug('testExecuteDMLs: data ready'); 
         
        List<SObject> results;
        try {
	        results = sfpegForceDML_CTL.executeDML(null);
            System.debug('testExecuteDMLs: null request fetched' + results); 
            System.assert(false);
        }
        catch (Exception e) {
            System.debug('testExecuteDMLs: null request error' + e.getMessage());
            System.assert(true);          
        }
         
        try {
	        results = sfpegForceDML_CTL.executeDML(requestList);
            System.debug('testExecuteDMLs: insert done ' + results); 
            System.assertEquals(results.size(),1);
            System.assertNotEquals(results[0].Id,null);
        }
        catch (Exception e) {
            System.debug('testExecuteDMLs: duplicates error' + e.getMessage());  
            System.assert(false);           
        }

        newTask.Id = results[0].Id;
        newTask.Subject = 'Test Update';
        newRequest.operation = 'update';
        sfpegForceDML_CTL.DmlRequest newRequest2 = new sfpegForceDML_CTL.DmlRequest();
        newRequest2.record = newTask2;
        newRequest2.operation = 'insert';
        requestList.add(newRequest2);
        System.debug('testExecuteDMLs: test data updated ');
        
        try {
	        results = sfpegForceDML_CTL.executeDML(requestList);
            System.debug('testExecuteDMLs: combined DML done ' + results); 
            System.assertEquals(results.size(),2);
        }
        catch (Exception e) {
            System.debug('testExecuteDMLs: combined DML error' + e.getMessage());
            System.assert(false);          
        }

        newTask.Subject = 'Test Failure';
        newRequest.operation = 'dummy';
        try {
	        results = sfpegForceDML_CTL.executeDML(requestList);
            System.debug('testExecuteDMLs: dummy DML done ' + results); 
            System.assert(false);
        }
        catch (Exception e) {
            System.debug('testExecuteDMLs: dummy DML error' + e.getMessage()); 
            System.assert(true);            
        }
		
		Test.stopTest();
        
		System.debug('testGetDuplicates: END');
    }

}