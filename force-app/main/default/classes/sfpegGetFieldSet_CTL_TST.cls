/***
* @description Test class for the sfpegGetFieldSet_CTL Flow Action controller class.
* @author      P-E GROS
* @date        Dec. 2020
* @see         sfpegGetFieldSet_CTL
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
public with sharing class sfpegGetFieldSet_CTL_TST {


/***
* @description Initializes the test context.
***/
    @testSetup
    static void testSetup() {
        System.debug('testSetup: START');

        System.debug('testSetup: END');
    }

/***
* @description Tests the "getFieldSetDescs" and implicitly the "getFieldSetDesc" methods.
***/    
    static TestMethod void testGetFieldSetDescs() {
        System.debug('testGetFieldSetDescs: START'); 

        ApexClass ac = [SELECT NameSpacePrefix FROM ApexClass
                        WHERE Name LIKE 'sfpegGetFieldSet_CTL_TST'];
        System.debug('testGetFieldSetDescs: NameSpace extracted' + ac);
        String nsRoot = (ac.NameSpacePrefix == null ? '' : ac.NameSpacePrefix + '__');
        String FieldSetName =  nsRoot + 'sfpegTest__c.' + nsRoot + 'TestFS';
        System.debug('testGetFieldSetDescs: FieldSetName init' + FieldSetName);
        String FieldSetNameKO =  nsRoot + 'sfpegTest__c.DUMMY';

        Test.startTest();

        // Standard working case
        try {
            List<String> nameList = new List<String>();
            nameList.add(FieldSetName);
            sfpegGetFieldSet_CTL.getFieldSetDescs(nameList);
            //sfpegConfiguration_CTL.getFieldSetDesc('Task.SFPEG_TSTFS');
            System.debug('testGetFieldSetDesc: no exception raised');
            System.assert(true);
        }
        catch (Exception e) {
            System.debug('testGetFieldSetDesc: exception raised (check 1st required SFPEG_TSTFS fieldset on Task object) ' + e.getMessage());
            System.assert(false);
        }

        // Error cases
        try {
            List<String> nameList = new List<String>();
            nameList.add(FieldSetNameKO);
            sfpegGetFieldSet_CTL.getFieldSetDescs(nameList);
            //sfpegConfiguration_CTL.getFieldSetDesc('Task.SFPEG_TSTFS');
            System.debug('testGetFieldSetDesc: no exception raised');
            System.assert(false);
        }
        catch (Exception e) {
            System.debug('testGetFieldSetDesc: exception raised ' + e.getMessage());
            System.assert(true);
        }
        
        try {
            List<String> nameList = new List<String>();
            nameList.add('Test.Test');
            sfpegGetFieldSet_CTL.getFieldSetDescs(nameList);
            System.debug('testGetFieldSetDesc: no exception raised for Test.Test');
            System.assert(false);
        }
        catch (Exception e) {
            System.debug('testGetFieldSetDesc: exception raised for Test.Test' + e.getMessage());
            System.assert(true);
        }

        try {
            List<String> nameList = new List<String>();
            nameList.add('Test');
            sfpegGetFieldSet_CTL.getFieldSetDescs(nameList);
            System.debug('testGetFieldSetDesc: no exception raised for Test');
            System.assert(false);
        }
        catch (Exception e) {
            System.debug('testGetFieldSetDesc: exception raised for Test' + e.getMessage());
            System.assert(true);
        }
        
        Test.stopTest();
        System.debug('testGetFieldSetDesc: END');
    }

}
