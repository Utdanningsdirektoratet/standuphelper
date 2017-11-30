import PropTypes from 'prop-types';

export const issue = PropTypes.shape({
  id: PropTypes.string.isRequired,
  assignee: PropTypes.string.isRequired,
  description: PropTypes.string,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  labels: PropTypes.arrayOf(PropTypes.string),
  unReleasedFixVersions: PropTypes.arrayOf(PropTypes.string),
  releasedFixVersions: PropTypes.number.isRequired,
  type: PropTypes.oneOf(['Story', 'Bug', 'Task']).isRequired,
  color: PropTypes.string.isRequired,
  url: PropTypes.string
});

export const phase = PropTypes.shape({
  title: PropTypes.string.isRequired,
  issues: PropTypes.arrayOf(issue).isRequired
});

export const board = PropTypes.shape({
  inProgress: phase.isRequired,
  merge: phase.isRequired,
  peerReview: phase.isRequired,
  test: phase.isRequired
});
