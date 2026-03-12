import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ConditionRisk {
    conditionName: string;
    riskLevel: string;
}
export interface Assessment {
    ageBucket: string;
    conditionRisks: Array<ConditionRisk>;
    conditions: Array<string>;
    symptoms: Array<string>;
    overallRiskLevel: string;
}
export interface backendInterface {
    getAggregatedStats(): Promise<{
        riskLevelBreakdown: Array<[string, bigint]>;
        topConditions: Array<[string, bigint]>;
        totalAssessments: bigint;
        topSymptoms: Array<[string, bigint]>;
    }>;
    submitAssessment(data: Assessment): Promise<void>;
}
