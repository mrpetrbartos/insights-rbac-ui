import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@patternfly/react-core';
import ExpandableContent from './expandable-content';

export const createRows = (data, filterValue = undefined) => {
  console.log('Debug - data', data);
  return data.filter(item => { const filter = filterValue ? item.name.includes(filterValue) : true;
    return filter; }).reduce((acc,  { uuid, name, description, members }, key) => ([
    ...acc, {
      uuid,
      isOpen: false,
      cells: [ <Fragment key={ uuid }><Link to={ `/groups/${uuid}` }>
        <Button variant="link"> { name } </Button></Link></Fragment>, description, members.length ]
    }, {
      parent: key * 2,
      fullWidth: true,
      cells: [{ title: <ExpandableContent description={ description } members={ members } /> }]
    }
  ]), []);
};

