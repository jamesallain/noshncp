

export const assessmentStandardType = new GraphQLEnumType({
  name: 'AssessmentStandard',
  values: {
    HIGH: { 
        value: 0,
        description: 'High/above goal'
    },
    NORMAL: { 
        value: 1,
        description: 'Normal, at goal'
    },
    LOW: { 
        value: 2,
    description: 'Low, below goal'
    }
  }
});