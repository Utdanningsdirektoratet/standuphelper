import React from 'react';
import Box from '@udir/udir-react-components/Box';
import { issue as issuePropType } from 'proptypes';

const Issue = ({ issue }) => {
  return (
    <Box className="u--marginBottom2">
      <div>
        <header>
          <h2 className="u--h2">
            {issue.name} - {issue.title}
          </h2>
        </header>
        <div>
          <div>
            <img src={issue.avatar} alt={issue.assignee} />
          </div>
          <div>
            <p dangerouslySetInnerHTML={{ __html: issue.description }}></p>
          </div>
        </div>
      </div>
    </Box>
  );
};

Issue.propTypes = {
  issue: issuePropType
};

export default Issue;
