import Map "mo:core/Map";
import Int "mo:core/Int";
import Text "mo:core/Text";
import List "mo:core/List";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Order "mo:core/Order";

actor {
  type ConditionRisk = {
    conditionName : Text;
    riskLevel : Text;
  };

  type Assessment = {
    ageBucket : Text;
    symptoms : [Text];
    conditions : [Text];
    overallRiskLevel : Text;
    conditionRisks : [ConditionRisk];
  };

  let assessments = List.empty<Assessment>();

  let riskLevelCounts = Map.fromArray<Text, Int>(
    [
      ("Low", 0),
      ("Moderate", 0),
      ("High", 0),
      ("Critical", 0),
    ]
  );

  module Pair {
    public func compare(pair1 : (Text, Int), pair2 : (Text, Int)) : Order.Order {
      Int.compare(pair1.1, pair2.1);
    };
  };

  public shared ({ caller }) func submitAssessment(data : Assessment) : async () {
    assessments.add(data);

    let count = switch (riskLevelCounts.get(data.overallRiskLevel)) {
      case (null) { 0 };
      case (?c) { c };
    };
    riskLevelCounts.add(data.overallRiskLevel, count + 1);
  };

  public query ({ caller }) func getAggregatedStats() : async {
    totalAssessments : Int;
    riskLevelBreakdown : [(Text, Int)];
    topSymptoms : [(Text, Int)];
    topConditions : [(Text, Int)];
  } {
    let totalAssessments = assessments.size();
    let riskLevelBreakdown = riskLevelCounts.toArray();

    let symptomCounts = Map.empty<Text, Int>();
    let conditionCounts = Map.empty<Text, Int>();

    assessments.values().forEach(
      func(asmt) {
        asmt.symptoms.forEach(
          func(symptom) {
            let count = switch (symptomCounts.get(symptom)) {
              case (null) { 0 };
              case (?c) { c };
            };
            symptomCounts.add(symptom, count + 1);
          }
        );
        asmt.conditions.forEach(
          func(condition) {
            let count = switch (conditionCounts.get(condition)) {
              case (null) { 0 };
              case (?c) { c };
            };
            conditionCounts.add(condition, count + 1);
          }
        );
      }
    );

    let topSymptoms = symptomCounts.toArray().sort().reverse().sliceToArray(0, Int.min(10, symptomCounts.size()));
    let topConditions = conditionCounts.toArray().sort().reverse().sliceToArray(0, Int.min(5, conditionCounts.size()));

    {
      totalAssessments;
      riskLevelBreakdown;
      topSymptoms;
      topConditions;
    };
  };
};
