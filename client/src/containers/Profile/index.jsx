import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getUserImgLink } from 'src/helpers/imageHelper';
import {
  Grid,
  Image,
  Input,
  Button,
  Modal,
  Icon
} from 'semantic-ui-react';
import * as imageService from 'src/services/imageService';
import ReactCrop from 'react-image-crop';
import { updateUser } from './actions';
import 'react-image-crop/dist/ReactCrop.css';

import styles from './styles.module.scss';

const cropInitial = {
  unit: 'px',
  width: 200,
  height: 200,
  aspect: 1 / 1
};

/* eslint-disable */
const Profile = ({
  user,
  updateUser
}) => {
  const [isEditMode, setEditMode] = useState(false);
  const [isOpenModal, setOpenModal] = useState(false);
  const [file, setFile] = useState(undefined);
  const [src, setSrc] = useState(undefined);
  const [isUploading, setIsUploading] = useState(false);
  const [crop, setCrop] = useState(cropInitial);
  const [image, setImage] = useState(undefined);
  const [username, setUserName] = useState(user.username);

  useEffect(() => {
    imageRef = image;
  });

  let imageRef = undefined;
  let fileUrl = undefined;

  const onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        setSrc(reader.result)
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onImageLoaded = image => {
    setImage(image);
    imageRef = image;
  };

  const onCropComplete = crop => {
    makeClientCrop(crop);
  };

  const onCropChange = crop => {
    setCrop(crop);
  };

  const makeClientCrop = async (crop) => {
    if (imageRef && crop.width && crop.height) {
      cropImg(
        imageRef,
        crop,
        'avatar.jpeg'
      );
    }
  };

  const cropImg = (image, crop, fileName) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    canvas.toBlob(blob => {
      if (!blob) {
        return;
      }
      blob.name = fileName;
      setFile(blob);
      window.URL.revokeObjectURL(fileUrl);
      fileUrl = window.URL.createObjectURL(blob);
    })
  };

  // TODO: not implement
  const toggleProfileMode = () => {
    if (isEditMode) {
      onSubmit();
    }
    setEditMode(!isEditMode);
  };

  const onChangeUserName = (e) => {
    setUserName(e.target.value);
  };

  const onSubmit = () => {
    setIsUploading(true);
    try {
      const updatedUser = { ...user, username };
      updateUser(updatedUser);
    } finally {
      setIsUploading(false);
    };    
  };

  const cancelModal = () => {
    setOpenModal(false);
    setSrc(undefined);
  };

  const openModal = () => {
    setOpenModal(true);
  };

  const handleUploadFile = async () => {
    setIsUploading(true);
    try {
      const { id: imageId, link: imageLink } = await uploadImage(file);
      const updatedUser = { ...user, imageId, imageLink };
      updateUser(updatedUser);
    } finally {
      // TODO: show error
      cancelModal();
      setIsUploading(false);
    }
  };

  const uploadImage = file => imageService.uploadImage(file);

  return (

    <Grid container textAlign="center" style={{ paddingTop: 30 }}>
      <Grid.Column>
        <Image centered onClick={openModal} src={getUserImgLink(user.image)} size="medium" circular className={styles.avatar} />
        <br />
        <Input
          icon="user"
          iconPosition="left"
          placeholder="Username"
          type="text"
          onChange={onChangeUserName}
          disabled={!isEditMode}
          value={username}
        />
        <br />
        <br />
        <Input
          icon="at"
          iconPosition="left"
          placeholder="Email"
          type="email"
          disabled
          value={user.email}
        />
        <br />
        <br />
        <Button type="button" color="teal" size="large" primary loading={isUploading} disabled={isUploading} onClick={toggleProfileMode}>
          {!isEditMode ? 'Edit' : 'Save' } 
        </Button>
      </Grid.Column>

      <Modal
        open={isOpenModal}
      >
        <Modal.Header>Upload avatar</Modal.Header>
        <Modal.Content>
          {src && (
            <ReactCrop
              src={src}
              crop={crop}
              circularCrop
              maxHeight="200"
              maxWidth="200"
              minHeight="100"
              minWidth="100"
              ruleOfThirds
              onImageLoaded={onImageLoaded}
              onComplete={onCropComplete}
              onChange={onCropChange}
            />
          )}
          {!src && (
            <Button color="teal" icon as="label" loading={isUploading} disabled={isUploading}>
              <Icon name="image" />
              Attach image
              <input name="image" type="file" onChange={onSelectFile} hidden />
            </Button>
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={cancelModal} negative disabled={isUploading}>
            Cancel
          </Button>

          {src && (
            <Button onClick={handleUploadFile} loading={isUploading} disabled={isUploading} positive>
              Upload
            </Button>
          )}

        </Modal.Actions>
      </Modal>
    </Grid>
  )
};

Profile.propTypes = {
  user: PropTypes.objectOf(PropTypes.any),
  updateUser: PropTypes.func.isRequired
};

Profile.defaultProps = {
  user: {}
};

const mapStateToProps = rootState => ({
  user: rootState.profile.user
});

const actions = {
  updateUser
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
