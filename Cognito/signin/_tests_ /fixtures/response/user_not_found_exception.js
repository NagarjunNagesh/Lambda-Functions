module.exports = {
  errorType: 'Error',
  errorMessage: 'Unable to signin from cognito  UserNotFoundException: User does not exist.',
  trace: [
    'Error: Unable to signin from cognito  UserNotFoundException: User does not exist.',
    '    at /var/task/index.js:23:14',
    '    at processTicksAndRejections (internal/process/task_queues.js:97:5)',
    '    at async Runtime.exports.handler (/var/task/index.js:20:5)',
  ],
};
