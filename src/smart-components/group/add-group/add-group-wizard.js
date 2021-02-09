import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/';
import { useHistory } from 'react-router-dom';
import FormRenderer from '@data-driven-forms/react-form-renderer/dist/esm/form-renderer';
import Pf4FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/esm/form-template';
import componentMapper from '@data-driven-forms/pf4-component-mapper/dist/esm/component-mapper';
import schema from './schema';
import { addGroup } from '../../../redux/actions/group-actions';
import SetRoles from './set-roles';
import SetUsers from './set-users';
import SummaryContent from './summary-content';

const FormTemplate = (props) => <Pf4FormTemplate {...props} showFormControls={false} />;

const Description = ({ Content, ...rest }) => <Content {...rest} />;
Description.propTypes = {
  Content: PropTypes.elementType.isRequired,
};

export const mapperExtension = {
  description: Description,
  'set-roles': SetRoles,
  'set-users': SetUsers,
  'summary-content': SummaryContent,
};

const AddGroupWizard = ({ postMethod }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const onCancel = () => {
    dispatch(
      addNotification({
        variant: 'warning',
        title: 'Adding group',
        dismissDelay: 8000,
        dismissable: false,
        description: 'Adding group was canceled by the user.',
      })
    );
    history.push('/groups');
  };

  const onSubmit = (formData) => {
    const groupData = {
      name: formData['group-name'],
      description: formData['group-description'],
      user_list: formData['users-list'].map((user) => ({ username: user.label })),
      roles_list: formData['roles-list'].map((role) => role.uuid),
    };
    history.push('/groups');
    dispatch(addGroup(groupData))
      .then(() => postMethod())
      .then(() => {
        dispatch(
          addNotification({
            variant: 'success',
            title: 'Success adding group',
            dismissDelay: 8000,
            dismissable: false,
            description: 'The group was added successfully.',
          })
        );
      });
  };

  return (
    <FormRenderer
      schema={schema}
      subscription={{ values: true }}
      FormTemplate={FormTemplate}
      componentMapper={{ ...componentMapper, ...mapperExtension }}
      onSubmit={onSubmit}
      onCancel={() => {
        onCancel();
      }}
    />
  );
};

AddGroupWizard.propTypes = {
  postMethod: PropTypes.func,
};

export default AddGroupWizard;
