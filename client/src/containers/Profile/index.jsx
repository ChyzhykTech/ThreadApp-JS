import React, { useState } from 'react';
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
import { uploadAvatar } from './actions';
import 'react-image-crop/dist/ReactCrop.css';

// import styles from './styles.module.scss';

const cropInitial = {
  unit: 'px',
  maxWidth: 200,
  maxHeight: 200,
  width: 100,
  height: 100,
  aspect: 1 / 1
};

/* eslint-disable */
const Profile = ({ 
  user,
  uploadAvatar
}) => {
  const [isNotEditMode, setEditMode] = useState(true);
  const [isOpenModal, setOpenModal] = useState(false);
  const [file, setFile] = useState(undefined);
  const [src, setSrc] = useState(undefined);
  const [image, setImage] = useState(undefined);
  const [isUploading, setIsUploading] = useState(false);
  const [crop, setCrop] = useState(cropInitial);
  const [croppedImageUrl, setCroppedImageUrl] = useState(undefined);

  let imageRef = undefined;
  let fileUrl = undefined;

  const onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      setFile(e.target.files[0]);
      reader.addEventListener('load', () =>      
        setSrc(reader.result)
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onImageLoaded = image => {
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
      const croppedImageUrl = await getCroppedImg(
        imageRef,
        crop,
        'newFile.jpeg'
      );
      setCroppedImageUrl(croppedImageUrl);
    }
  };

  const getCroppedImg = (image, crop, fileName) => {
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


    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          //reject(new Error('Canvas is empty'));
          return;
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(fileUrl);
        fileUrl = window.URL.createObjectURL(blob);
        resolve(fileUrl);
      }, 'image/jpeg');
    });
  };

  const toggleProfileMode = () => {
    setEditMode(!isNotEditMode);
  };

  const cancelModal = () => {
    setOpenModal(false);
    setSrc(undefined);
  };

  const openModal = () => {
    setOpenModal(true);
  };

  // TODO: upload avatar to user entity
  const handleUploadFile = async () => {
    setIsUploading(true);
    try {
      const { id: imageId, link: imageLink } = await uploadImage(file);
      setImage({ imageId, imageLink });
      const newUser = {...user, imageId, imageLink  };
      uploadAvatar(newUser);    
    } finally {
      // TODO: show error
      setIsUploading(false);
      console.log(user);
    }
  };

  const uploadImage = file => imageService.uploadImage(file);

  return (

    <Grid container textAlign="center" style={{ paddingTop: 30 }}>
      <Grid.Column>
        <Image centered onClick={openModal} src={getUserImgLink(user.image)} size="medium" circular />
        <br />
        <Input
          icon="user"
          iconPosition="left"
          placeholder="Username"
          type="text"
          disabled={isNotEditMode}
          value={user.username}
        />
        <br />
        <br />
        <Input
          icon="at"
          iconPosition="left"
          placeholder="Email"
          type="email"
          disabled={isNotEditMode}
          value={user.email}
        />
        <br />
        <br />
        <Button type="button" color="teal" size="large" primary onClick={toggleProfileMode}>
          Edit profile
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
          <Button onClick={cancelModal} negative>
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
  uploadAvatar: PropTypes.func.isRequired
};

Profile.defaultProps = {
  user: {}
};

const mapStateToProps = rootState => ({
  user: rootState.profile.user
});

const actions = {
  uploadAvatar
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
