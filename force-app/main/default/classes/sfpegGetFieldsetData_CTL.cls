/***
* @author P-E GROS
* @date   Dec. 2020
* @description Flow controller class to check duplicates of a new record from a Flow.
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

public with sharing class sfpegGetFieldsetData_CTL {

/***
* @description	Invocable method to easily fetch data corresponding to a given
*               fieldset for a series of records based on their IDs.
* @param		dataRequests	List of 'DataRequest' records containing the 
*                               records for which data should be fetched and the FieldSet
*                               name (as 'Object.Fieldset', i.e. Object API & FS Developer
*                               names). Each record should have an ID !
* @return		List<List<SObject>>		List of matching records (of same sobject type with
*                                       proper authorized fieldset fields returned).
* @exception   	dmlExceptions in case of processing issue.
***/    
    @InvocableMethod(label='Get Records Data' description='Get data of a given fieldset for a list of records.' category='SF PEG')
	public static List<List<SObject>> getData(List<DataRequest> dataRequests) {
		System.debug('getData: START');
		//System.debug('getData: newRecords received ' + newRecords);
        
        if ((dataRequests == null) || (dataRequests.size() == 0)) {
			System.debug('getData: END KO / missing input dataRequests');
            throw new dmlException('Missing input');
        }
        
        String fieldsetName =  dataRequests[0].fieldset;
		System.debug('getData: fieldsetName extracted ' + fieldsetName);        
        if (String.isBlank(fieldsetName)) {
            System.debug('getData: END KO / missing fieldSet Name ');
            throw new dmlException('Missing fieldset name');
        }
      
        // init record ID list
        Set<String> recordIDs = new Set<String>();
        for (DataRequest iter : dataRequests) {
			System.debug('getData: registering iter ' + iter);
            for (SObject iterRcd : iter.records) {
				System.debug('getData: registering record ' + iterRcd);
            	recordIDs.add(iterRcd.Id);
            }
        }                                
		System.debug('getData: recordIDs extracted ' + recordIDs);
        
        // init field api name list
        Map<String,Object> fieldSetDesc =   sfpegGetFieldSet_CTL.getFieldSetDesc(fieldsetName);
        System.debug('getData: fieldSetDesc fetched ' + fieldSetDesc);
        List<Map<String,Object>> fieldDescs = (List<Map<String,Object>>) (fieldSetDesc.get('fields'));
        System.debug('getData: fieldDescs extracted ' + fieldDescs);
        Set<String> fieldSet = new Set<String>();
        if (fieldDescs != null) {
            System.debug('getData: adding fields from fieldSet');
            for (Map<String,Object> iterField : fieldDescs) {
                System.debug('getData: processing iterField ' + iterField);
                fieldSet.add((String)(iterField.get('name')));
            }
            System.debug('getData: set of field names init ' + fieldSet);
        }
        if (!String.isBlank(dataRequests[0].fieldNames)) {
			System.debug('getData: adding special fields ' + dataRequests[0].fieldNames);
            fieldSet.addAll(dataRequests[0].fieldNames.split(','));            
        }
		System.debug('getData: set of field names finalised ' + fieldSet);
        
        // init and execute SOQL query
        String soqlQuery = 'SELECT ' + String.join(new list<String>(fieldSet),',')
            			+ ' FROM ' + fieldsetName.left(fieldsetName.indexOf('.'))
            			+ ' WHERE ID in (\'' + String.join(new List<String>(recordIDs),'\',\'') + '\')';
		System.debug('getData: soqlQuery init ' + soqlQuery);    
        
        Map<ID,SObject> resultMap = new Map<ID,SObject>(database.query(soqlQuery));
		System.debug('getData: data fetched init ' + resultMap);    
        
        // format record result list
        List<List<SObject>> resultList = new List<List<SObject>>();
        for (DataRequest iter : dataRequests) {
			System.debug('getData: finalising iter ' + iter);
            
            List<SObject> newData = new List<SObject>();    
            resultList.add(newData);
            for (SObject iterRcd : iter.records) {
                System.debug('getData: processing record ' + iterRcd);
                Sobject iterData = resultMap.get(iterRcd.Id);
                System.debug('getData: iter data fetcched ' + iterData);
            	newData.add(iterData);                
            }
        }
        
		System.debug('getData: END OK with ' + resultList);        
        return resultList;
	}   
    
/***
* @description	Subclass required to pass input parameters into the 'getData' invocable action
*               (especially to provide the fieldset name).
***/
    public class DataRequest {
  		@InvocableVariable(label='Records to Match' description='Records to match' required=true)
  		public List<SObject> records;
        @InvocableVariable(label='Fieldset' description='Fieldset to return' required=true)
  		public String fieldset;
        @InvocableVariable(label='Fields' description='Individual fields to return' required=false)
  		public String fieldNames;
  	}  
}