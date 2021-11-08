/***
* @description Test class for the sfpegGetDuplicates_CTL class.
* @author      P-E GROS
* @date        Dec. 2020
* @see         sfpegGetDuplicates_CTL
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
public class  sfpegGetDuplicates_CTL_TST {
    
/***
* @description Initializes the test context.
***/
    @testSetup
    static void testSetup() {
        System.debug('testSetup: START');

        List<sfpegTest__c> newTests  = new List<sfpegTest__c>();
        sfpegTest__c newTest1 = new sfpegTest__c(Name = 'Test1');
        newTests.add(newTest1);
        sfpegTest__c newTest2 = new sfpegTest__c(Name = 'Test2',Data__c = 'Data2');
        newTests.add(newTest2);

        insert newTests;

        System.debug('testSetup: END');
    }


/***
* @description Tests the "getDuplicates" method.
***/
    
    static TestMethod void testGetDuplicates() {
        System.debug('testGetDuplicates: START'); 
        Test.startTest();
        
        //List<List<SObject>> results;
        List<sfpegGetDuplicates_CTL.MatchResults> results;
        try {
	        results = sfpegGetDuplicates_CTL.getDuplicates(null);
            System.debug('testGetDuplicates: null duplicates fetched' + results); 
            system.assert(false);
        }
        catch (Exception e) {
            System.debug('testGetDuplicates: null duplicates error' + e.getMessage());  
            system.assert(true);           
        }
        
        List<SObject> newTests  = new List<SObject>();
        sfpegTest__c newTest1 = new sfpegTest__c(Name = 'Test1');
        newTests.add(newTest1);
        sfpegTest__c newTest11 = new sfpegTest__c(Name = 'Test1', Data__c = 'Data1');
        newTests.add(newTest11);
        sfpegTest__c newTest2 = new sfpegTest__c(Name = 'Test2');        
        newTests.add(newTest2);
        sfpegTest__c newTest22 = new sfpegTest__c(Name = 'Test2', Data__c = 'Data2');
        newTests.add(newTest22);
        System.debug('testGetDuplicates: data ready ' + newTests); 

        try {
	        results = sfpegGetDuplicates_CTL.getDuplicates(newTests);
            System.debug('testGetDuplicates: duplicates fetched' + results); 
            system.assert(true);
        }
        catch (Exception e) {
            System.debug('testGetDuplicates: duplicates error' + e.getMessage());  
            system.assert(false);           
        }

		Integer iter = 0;
        while (iter < 50) {
            newTests.add(new sfpegTest__c(Name = 'Test' + iter));
            iter++;
        }
        try {
	        results = sfpegGetDuplicates_CTL.getDuplicates(newTests);
            System.debug('testGetDuplicates: > 50 duplicates fetched' + results); 
            system.assert(false);
        }
        catch (Exception e) {
            System.debug('testGetDuplicates: > 50 duplicates error' + e.getMessage()); 
            system.assert(true);            
        }

        
		Test.stopTest();
        
		System.debug('testGetDuplicates: END');
    }

    static TestMethod void testDummy() {
        System.debug('testDummy: START'); 
        Test.startTest();
        (new sfpegGetDuplicates_CTL.DummyTestClass()).dummyMethod();
        Test.stopTest();
		System.debug('testDummy: END');
    }
}