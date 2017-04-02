

export const diagnosisStatusType = new GraphQLEnumType({
  name: 'DiagnosisStatus',
  values: {
    NEW: { 
        value: 0,
        description: 'New diagnosis'
    },
    CONTINUED: { 
        value: 1,
        description: 'Continued diagnosis'
    },
    RESOLVED: { 
        value: 2,
        description: 'Resolved diagnosis'
    },    
    REMOVED: { 
        value: 3,
        description: 'Removed diagnosis'
    }
  }
});

