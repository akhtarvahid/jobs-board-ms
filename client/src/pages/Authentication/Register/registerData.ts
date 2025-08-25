const fieldObjs = [
  {
    type: 'text',
    placeholder: 'Enter your name',
    name: 'user.username',
    validation: {
      required: { value: true, message: 'Name is required.' },
      minLength: 1
    }
  },
  {
    type: 'email',
    placeholder: 'Enter email',
    name: 'user.email',
    validation: {
      required: { value: true, message: 'Email is required.' },
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
        message: 'Invalid email format.'
      }
    }
  },
  {
    type: 'password',
    placeholder: 'Enter password',
    name: 'user.password',
    validation: {
      required: { value: true, message: 'Password is required.' },
      minLength: {
        value: 5,
        message: 'Password must be at least 5 characters long.'
      },
      pattern: {
        value: /[^a-zA-Z0-9]/,
        message: 'Password must include at least one special character.'
      }
    }
  }
]

export default fieldObjs
