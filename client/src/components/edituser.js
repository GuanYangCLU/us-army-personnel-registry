import React, { useState, useEffect, useRef } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  editUser,
  initEdit,
  setSuperiorList
} from '../redux/action-creators/users';
import { getUser } from '../redux/action-creators/users';
import { setAlert } from '../redux/action-creators/alert';
import { Loading, Alert } from './utils';
import axios from 'axios';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import { FormLabel, InputLabel } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';

import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';

const EditUser = ({
  setAlert,
  editUser,
  alertContent,
  history,
  editSuccess,
  match,
  isLoading,
  isGetting,
  initEdit,
  getUser,
  user,
  error,
  getError,
  setSuperiorList,
  superiorList,
  users,
  config
}) => {
  const id = match.params.userId;
  console.log('this time: ', users);

  useEffect(() => {
    setSuperiorList(id);
    getUser(id, setUserData);
  }, []);

  const [userData, setUserData] = useState({
    avatar:
      'https://s.yimg.com/aah/priorservice/us-army-new-logo-magnet-15.gif',
    name: '',
    sex: '',
    rank: '',
    startdate: '',
    phone: '',
    email: '',
    superior: '' // Id
  });

  const {
    avatar,
    name,
    sex,
    rank,
    startdate,
    phone,
    email,
    superior
  } = userData;

  const handleChange = e => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleEdit = e => {
    e.preventDefault();
    // console.log({
    //   avatar,
    //   name,
    //   sex,
    //   rank,
    //   startdate,
    //   phone,
    //   email,
    //   superior
    // });

    editUser(
      id,
      {
        avatar,
        name,
        sex,
        rank,
        startdate,
        phone,
        email,
        superior
      },
      initEdit,
      users,
      config
    );
  };

  const handleBack = () => {
    history.push('/');
  };

  const rankList = ['General', 'Colonel', 'Major', 'Private'];

  const [file, setFile] = useState(null);

  const handleSelect = e => {
    setFile(e.target.files[0]);
  };

  const handleUpload = e => {
    const fd = new FormData();
    fd.append('image', file);
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };
    axios
      .post('http://localhost:5000/upload', fd, config)
      .then(res => {
        console.log(res);
        setUserData({
          ...userData,
          avatar: `http://localhost:5000/${res.data.filePath}`
        });
      })
      .catch(err => console.log(err));
  };

  const handleSelectRef = () => {
    uploadEl.current.click();
  };

  const uploadEl = useRef(null);

  const useStyles = makeStyles(theme => ({
    // appBar: {
    //   position: 'relative',
    // },
    layout: {
      width: 'auto',
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
      [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
        width: 600,
        marginLeft: 'auto',
        marginRight: 'auto'
      }
    },
    paper: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
      padding: theme.spacing(2),
      [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
        marginTop: theme.spacing(6),
        marginBottom: theme.spacing(6),
        padding: theme.spacing(3)
      }
    },
    sex: {
      position: 'relative',
      top: theme.spacing(1.7),
      marginRight: theme.spacing(2),
      color: 'black'
    },
    buttons: {
      display: 'flex',
      justifyContent: 'flex-end'
    },
    button: {
      marginTop: theme.spacing(1),
      marginLeft: theme.spacing(1),
      marginBottom: theme.spacing(2)
    },
    fillSpace: {
      width: theme.spacing(15),
      margin: theme.spacing(1, 1, 1, 1)
    },
    badge: {
      width: theme.spacing(5),
      // height: '50%'
      // (top, right, bottom, left)
      margin: theme.spacing(1, 1, 1, 0)
    },
    formName: {
      marginTop: theme.spacing(1)
    },
    avatarHead: {
      textAlign: 'center'
    },
    avatar: {
      margin: '0 auto',
      width: theme.spacing(30),
      height: theme.spacing(30)
    },
    uploadButtons: {
      margin: '0 auto',
      padding: theme.spacing(0, 0, 0, 1)
    }
  }));

  const classes = useStyles();

  return (
    <div>
      {editSuccess ? (
        <Redirect to='/' />
      ) : isLoading || isGetting ? (
        <Loading />
      ) : (
        <div>
          <main className={classes.layout}>
            <Paper className={classes.paper}>
              <form onSubmit={handleEdit}>
                <div className={classes.buttons}>
                  <img
                    className={classes.badge}
                    src='https://s.yimg.com/aah/priorservice/us-army-new-logo-magnet-15.gif'
                  />
                  <Typography
                    className={classes.formName}
                    variant='h4'
                    gutterBottom
                  >
                    Edit Soldier
                  </Typography>
                  <div className={classes.fillSpace} />

                  <Button
                    // display='inline'
                    variant='contained'
                    color='success'
                    onClick={handleBack}
                    className={classes.button}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant='contained'
                    color='primary'
                    type='submit'
                    className={classes.button}
                  >
                    Save
                  </Button>
                </div>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6} lg={6}>
                    <div
                      className={classes.avatarHead}
                      // variant='p'
                      // gutterBottom
                      fullWidth
                    >
                      Avatar
                    </div>
                    <br />
                    <div className={classes.avatar}>
                      <img
                        alt='avatar'
                        src={avatar}
                        id='avatar'
                        name='avatar-preview'
                        // label='Avatar'
                        style={{ width: '100%', height: '100%' }}
                        // fullWidth
                      />
                    </div>

                    <input
                      name='avatar-upload'
                      accept='image/*'
                      // className={classes.input}
                      style={{ display: 'none' }}
                      // value={avatar}
                      onChange={handleSelect}
                      ref={uploadEl}
                      // id='raised-button-file'
                      multiple
                      type='file'
                    />
                    <div className={classes.uploadButtons}>
                      <div>
                        <Button
                          variant='contained'
                          color='primary'
                          // component='span'
                          className={classes.button}
                          onClick={handleSelectRef}
                        >
                          Pick Avatar
                        </Button>
                        {/* <label htmlFor='raised-button-file'> */}
                        <Button
                          variant='contained'
                          color='secondary'
                          // component='span'
                          className={classes.button}
                          onClick={handleUpload}
                        >
                          Upload
                        </Button>
                        {/* </label> */}
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={6}>
                    <TextField
                      required
                      id='name'
                      name='name'
                      value={name}
                      onChange={handleChange}
                      label='Name'
                      fullWidth
                      autoComplete='name'
                    />
                    <FormControl fullWidth>
                      <InputLabel htmlFor='rank-native-helper'>Rank</InputLabel>
                      <Select
                        native
                        value={rank}
                        onChange={handleChange}
                        inputProps={{ name: 'rank', id: 'rank-native-helper' }}
                      >
                        <option value='' />
                        {rankList.map(rank => {
                          return <option value={rank}>{rank}</option>;
                        })}
                      </Select>
                    </FormControl>

                    {/* <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox color='secondary' name='male' value='Male' />
                  }
                  label='Male'
                />
                <FormControlLabel
                  control={
                    <Checkbox color='secondary' name='female' value='Female' />
                  }
                  label='Female'
                />
              </Grid> */}

                    <RadioGroup
                      name='sex'
                      aria-label='sex'
                      value={sex}
                      onChange={handleChange}
                      row
                    >
                      <FormLabel className={classes.sex}>Sex: </FormLabel>
                      {['Male', 'Female'].map(sex => (
                        <FormControlLabel
                          value={sex}
                          control={<Radio />}
                          label={sex}
                        />
                      ))}
                    </RadioGroup>

                    <TextField
                      required
                      id='startdate'
                      name='startdate'
                      value={startdate}
                      onChange={handleChange}
                      label='Start Date'
                      fullWidth
                      autoComplete='startdate'
                    />
                    {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    margin='normal'
                    id='date-picker-dialog'
                    label='Start Date'
                    format='MM/dd/yyyy'
                    name='startdate'
                    value={startdate}
                    onChange={handleChange}
                    // onChange={handleDateChange}
                    KeyboardButtonProps={{
                      // name: 'startdate',
                      'aria-label': 'change date'
                    }}
                    fullWidth
                  />
                </MuiPickersUtilsProvider> */}

                    <TextField
                      required
                      id='phone'
                      name='phone'
                      value={phone}
                      onChange={handleChange}
                      label='Office Phone'
                      fullWidth
                      autoComplete='phone'
                    />

                    <TextField
                      required
                      id='email'
                      name='email'
                      value={email}
                      onChange={handleChange}
                      label='Email'
                      fullWidth
                      autoComplete='email'
                    />

                    <FormControl fullWidth>
                      <InputLabel htmlFor='superior-native-helper'>
                        Superior
                      </InputLabel>
                      <Select
                        native
                        value={superior._id}
                        onChange={handleChange}
                        inputProps={{
                          name: 'superior',
                          id: 'superior-native-helper'
                        }}
                      >
                        <option value='' />
                        {superiorList.map(superior => {
                          return (
                            <option value={superior._id}>
                              {superior.name}
                            </option>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </main>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    alertContent: state.alert.alertContent,
    editSuccess: state.editUser.editSuccess,
    isLoading: state.editUser.isLoading,
    isGetting: state.getUser.isLoading,
    user: state.getUser.user,
    // use this user in file check whether the file be changed in the very bottom
    error: state.editUser.error,
    getError: state.getUser.error,
    superiorList: state.superiors.superiorList, // need change
    users: state.users.users,
    config: state.users.config
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setAlert: alert => dispatch(setAlert(alert)),
    editUser: (id, data, initEdit, users, config) =>
      dispatch(editUser(id, data, initEdit, users, config)),
    initEdit: () => dispatch(initEdit()),
    getUser: (id, setUserData) => dispatch(getUser(id, setUserData)),
    setSuperiorList: id => dispatch(setSuperiorList(id))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditUser);
