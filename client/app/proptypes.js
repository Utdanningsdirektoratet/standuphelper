import PropTypes from 'prop-types';

export const issue = PropTypes.shape({
  id: PropTypes.string.isRequired,
  assignee: PropTypes.string.isRequired,
  description: PropTypes.string,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['Story', 'Bug', 'Task']).isRequired,
  url: PropTypes.string
});

export const phase = PropTypes.shape({
  issues: PropTypes.arrayOf(issue).isRequired
});

export const board = PropTypes.shape({
  inProgress: phase.isRequired,
  merge: phase.isRequired,
  peerReview: phase.isRequired,
  test: phase.isRequired
});
