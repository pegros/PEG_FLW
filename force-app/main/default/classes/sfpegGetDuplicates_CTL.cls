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
@SuppressWarnings('PMD.ClassNamingConventions')
public with sharing class sfpegGetDuplicates_CTL {

	/***
	* @description	Invocable method to easily fetch duplicates of a record, while returning
	*               their compact layout fields.
	* @param		newRecords		List of records for which duplicates should be searched (should
	*                               be of same type and less than 50)
	* @return		List<MatchResults>		List of duplicates for each record (of same sobject type)
	*                                       with set of fields corresponding to their compact layout,
	*                                       and with the list of applicable duplicate rule warning
	*                                       messages (concatenated with <br/> tags for easy display).
	* @exception   	dmlExceptions in case of processing issue. An empty list is returned in case of
	*               duplicate search issue (typically no matching rule defined on object).
	***/
	@InvocableMethod(label='Get Duplicates' description='Get duplicates of a record to create.' category='SF PEG')
	public static List<MatchResults> getDuplicates(List<SObject> newRecords) {
		System.debug('getDuplicates: START');

		if ((newRecords == null) || (newRecords.size() == 0)) {
			System.debug('getDuplicates: END KO / missing input records');
			throw new dmlException('Missing input records');
		}
		if (newRecords.size() > 50) {
			System.debug('getDuplicates: END KO / too many records 50 < ' + newRecords.size());
			throw new dmlException('Too many records');
		}

		List<MatchResults> resultList = new List<MatchResults>();
		try {
			List<Datacloud.FindDuplicatesResult> duplicates = Datacloud.FindDuplicates.findDuplicates(newRecords);
			System.debug('getDuplicates: duplicates searched ' + duplicates);
			Integer index = 0;
			for (Datacloud.FindDuplicatesResult findDupeResult : duplicates) {
				System.debug('getDuplicates: processing index ' + index);
				SObject newRecord = newRecords.get(index);
				System.debug('getDuplicates: new record ' + newRecord);
				System.debug('getDuplicates: of type ' + newRecord.getSObjectType().getDescribe(SObjectDescribeOptions.DEFERRED));

				Set<ID> recordIdMatches = new Set<ID>();
				List<SObject> recordMatches = new List<SObject>();
				List<String> warningMsgs = new List<String>();
  				for (Datacloud.DuplicateResult dupeResult : findDupeResult.getDuplicateResults()) {
					System.debug('getDuplicates: dupeResult fetched ' + dupeResult);

					if (dupeResult.getMatchResults().size() > 0) {
						System.debug('getDuplicates: #duplicates to process ' + dupeResult.getMatchResults().size());

						System.debug('getDuplicates: registering message ' + dupeResult.getErrorMessage());
						warningMsgs.add(dupeResult.getErrorMessage());

						for (Datacloud.MatchResult matchResult : dupeResult.getMatchResults()) {
							System.debug('getDuplicates: matchResult fetched ' + matchResult);
	  						for (Datacloud.MatchRecord matchRecord : matchResult.getMatchRecords()) {
								SObject matchSobject = matchRecord.getRecord();
								System.debug('getDuplicates: Duplicate Record found ' + matchSobject);
								if (recordIdMatches.contains(matchSobject.Id)) {
									System.debug('getDuplicates: Duplicate Record already registered');
								}
								else {
									System.debug('getDuplicates: registering Duplicate Record');
									recordMatches.add(matchSobject);
									recordIdMatches.add(matchSobject.Id);
								}
							}
						}
					}
					else {
						System.debug('getDuplicates: no duplicates to process ');
						System.debug('getDuplicates: message ignored ' + dupeResult.getErrorMessage());
					}
				}
				System.debug('getDuplicates: recordMatches init ' + recordMatches);
				MatchResults resultItem = new MatchResults();
				resultItem.records = recordMatches;
				resultItem.messages = String.join(warningMsgs,'<br/>');
				System.debug('getDuplicates: resultItem init ' + resultItem);
				resultList.add(resultItem);
				index++;
			}
		}
		catch (Exception e) {
			System.debug('getDuplicates: duplicates search failed ' + e.getMessage());
			return null;
		}
		System.debug('getDuplicates: duplicates found ' + resultList);

		System.debug('getDuplicates: END OK');
		return resultList;
	}

	/***
	* @description	Subclass required to pass output parameters into the 'getDuplicates' invocable action
	*               (especially to provide the "save allowed" boolean flag).
	***/
	public class MatchResults {
		@InvocableVariable(label='Matching Records' description='Matching Records determined by rules' required=true)
		public List<SObject> records;
		@InvocableVariable(label='Messages' description='Warning messages of the duplicate rules triggered' required=true)
		public String messages;
	}
}