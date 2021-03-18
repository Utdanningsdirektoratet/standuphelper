import PropTypes from 'prop-types';

export const issue = PropTypes.shape({
  id: PropTypes.string,
  assignee: PropTypes.string,
  description: PropTypes.string,
  name: PropTypes.string,
  title: PropTypes.string,
  labels: PropTypes.arrayOf(PropTypes.string),
  unReleasedFixVersions: PropTypes.arrayOf(PropTypes.string),
  releasedFixVersions: PropTypes.number,
  type: PropTypes.oneOf(['Story', 'Bug', 'Task']),
  color: PropTypes.string,
  url: PropTypes.string
});

export const phase = PropTypes.shape({
  title: PropTypes.string.isRequired,
  issues: PropTypes.arrayOf(issue).isRequired
});

export const board = PropTypes.shape({
  inProgress: phase,
  merge: phase,
  peerReview: phase,
  test: phase
});
