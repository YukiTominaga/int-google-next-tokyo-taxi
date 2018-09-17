import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, retry } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';
import { RESULT_TYPE } from '../../models/ResultType';

declare const gapi: any;

export class RankingResult {
  name: string;
  count: number;
  rate?: number;
}

export class QueryDetail {
  id: string;
  jpText: string;
  enText: string;
  query: string;
  secondQuery?: string;
  datasetId: string;
  tableId: string[];
  resultType: RESULT_TYPE;
}

@Injectable({
  providedIn: 'root'
})
export class GisQueryService {
  private projectId: string = environment.firebase.projectId;
  private baseEndpoint: string = 'https://www.googleapis.com/bigquery/v2/projects/' + this.projectId;
  private auth2: any;
  private executingJobId: string;

  constructor(private http: HttpClient, public afAuth: AngularFireAuth) {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: environment.google.clientId,
        scope: environment.google.scope,
      });
    });
  }

  private getGoogleAccessToken(): string {
    return this.auth2.currentUser.get().getAuthResponse().access_token;
  }

  public login(): Promise<firebase.User> {
    return this.auth2.signIn().then(googleUser => {
      const googleCredential = auth.GoogleAuthProvider.credential(null, googleUser.getAuthResponse().access_token);
      return this.afAuth.auth.signInWithCredential(googleCredential);
    });
  }

  public logout(): void {
    gapi.auth2.getAuthInstance().signOut().then(function() {
      console.log(gapi.auth2.getAuthInstance().isSignedIn);
    });
    this.afAuth.auth.signOut();
  }

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.getGoogleAccessToken(),
      }),
    };
  }

  public async getNumRowsOf(datasetId: string, tableIdList: string[]): Promise<number> {
    let numRowTotal = 0;
    for (const tableId of tableIdList) {
      const url = this.baseEndpoint + '/datasets/' + datasetId + '/tables/' + tableId;
      const numRow = await this.http.get<number>(url, this.getHttpOptions()).pipe(
        // @ts-ignore
        map(res => res.numRows),
      ).toPromise();
      numRowTotal += parseInt(numRow, 10);
    }
    return numRowTotal;
  }

  public getTotalBytesProcessed(query: string): Promise<number> {
    const url = this.baseEndpoint + '/queries';
    const body = {
      'query': query,
      'dryRun': true,
      'useLegacySql': false,
    };

    const httpRes = this.http.post<number>(url, body, this.getHttpOptions()).pipe(
      // @ts-ignore
      map(res => res.totalBytesProcessed),
    ).toPromise();

    return httpRes;
  }

  public async getExecuteTime() {
    const jobUrl = this.baseEndpoint + '/' + 'jobs/' + this.executingJobId;
    return await this.http.get(jobUrl, this.getHttpOptions()).toPromise();
  }

  public async execute(query: string, resultType: RESULT_TYPE): Promise<any> {
    const url = this.baseEndpoint + '/queries';
    const body = {
      'query': query,
      'useLegacySql': false,
    };

    this.executingJobId = await this.http.post<any>(url, body, this.getHttpOptions()).pipe(
      // @ts-ignore
      map(res => res.jobReference.jobId),
    ).toPromise();

    const getUrl = url + '/' + this.executingJobId;

    let isComplete = false;
    let res;
    while (!isComplete) {
      res = await this.http.get(getUrl, this.getHttpOptions()).pipe(
        retry(3),
      ).toPromise();

      // @ts-ignore
      if (res.jobComplete === true) {
        isComplete = true;
      }
    }
    return this.convertApiResponse(resultType, res);
  }

  public convertApiResponse(resultType: RESULT_TYPE, result): any {
    switch (resultType) {
      case RESULT_TYPE.SINGLE_VALUE:
        return result.rows[0]['f'][0]['v'];
      case RESULT_TYPE.RANKING:
        return this.constructRankingDataFromApiResult(result.rows);
    }
  }

  private constructRankingDataFromApiResult(apiResults): RankingResult[] {
    const rideOnRankingResults: RankingResult[] = [];
    let totalRideOnCount = 0;

    apiResults.forEach(res => {
      const rideOnRankingResult: RankingResult = {name: res['f'][0]['v'], count: res['f'][1]['v']};
      totalRideOnCount += rideOnRankingResult.count;
      rideOnRankingResults.push(rideOnRankingResult);
    });

    const totalRates = [];

    rideOnRankingResults.forEach(detail => {
      const rate = detail.count / totalRideOnCount * 100;
      totalRates.push(rate);
    });

    const maxCount: number = Math.max.apply(null, totalRates); // get max value in rateTotal array.

    totalRates.forEach((count, idx) => {
      const rate = count / maxCount; // 最大値を100とした場合の比率を求める
      rideOnRankingResults[idx].rate = rate;
    });
    return rideOnRankingResults;
  }
}
