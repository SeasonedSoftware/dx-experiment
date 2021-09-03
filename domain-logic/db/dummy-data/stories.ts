const stories = [
  {
    asA: 'User',
    iWant: 'add stories',
    soThat: 'I can record the project needs',
    scenarios: {
      create: [
        {
          description: `Given I'm logged in, When I land on the home page, Then I see a story creation form`,
        },
      ],
    },
  },
  {
    asA: 'User',
    iWant: 'see a list of my stories',
    soThat: 'I can understand my project needs',
  },
  {
    asA: 'User',
    iWant: 'edit my stories',
    soThat: 'I can improve my stories',
  },
]

export { stories }
