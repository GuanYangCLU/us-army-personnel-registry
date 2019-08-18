import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { createUser, initUser } from '../redux/action-creators/users';
import { setAlert } from '../redux/action-creators/alert';
import { Loading, Alert } from './utils';

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

import { KeyboardDatePicker } from '@material-ui/pickers';

const CreateUser = ({
  setAlert,
  createUser,
  alertContent,
  history,
  createSuccess,
  isLoading,
  error
}) => {
  // useEffect(() => initUser(), []); // may not need anymore
  const stdSex = ['f', 'm', 'female', 'male'];

  const [userData, setUserData] = useState({
    firstname: '',
    lastname: '',
    sex: '',
    age: '',
    password: '',
    repeat: ''
  });

  const { firstname, lastname, sex, age, password, repeat } = userData;

  // const submitUser = async () => {
  //   let rs = await createUser({ firstname, lastname, sex, age, password });
  //   console.log(rs);
  //   if (rs === 'success') {
  //     initUser();
  //     history.push('/');
  //   } else {
  //     setAlert('Failed to create!');
  //   }
  // };

  const handleCreate = e => {
    e.preventDefault();
    if (password !== repeat) {
      setAlert('Password does not match!');
    } else {
      createUser({ firstname, lastname, sex, age, password });
    }
  };

  const handleChange = e => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleBack = () => {
    history.push('/');
  };

  const disableCreate = (firstname, lastname, sex, age, password, repeat) => {
    return !(
      firstname &&
      lastname &&
      sex &&
      age &&
      password &&
      repeat &&
      password === repeat &&
      /^[a-zA-Z]+$/.test(firstname) &&
      /^[a-zA-Z]+$/.test(lastname) &&
      stdSex.indexOf(sex.toLowerCase()) !== -1 &&
      !isNaN(age) &&
      Math.abs(parseInt(age)).toString() === age.toString()
    );
  };

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
      marginTop: theme.spacing(3),
      marginLeft: theme.spacing(1)
    }
  }));

  const classes = useStyles();
  const [sex2, setSex] = useState('');
  const handleSex = (e, sex2) => {
    setSex(sex2);
    // console.log('Sex: ', sex2);
  };

  const rankList = ['General', 'Colonel', 'Major', 'Private'];

  const [userRank, setUserRank] = useState('');

  const handleRank = e => {
    setUserRank(e.target.value);
    // console.log(e.target.value);
  };

  const superiorList = ['Boss', 'Rum', 'Gin', 'Kir'];

  const [userSuperior, setUserSuperior] = useState('');

  const handleSuperior = e => {
    setUserSuperior(e.target.value);
    // console.log(e.target.value);
  };

  const [selectedDate, setSelectedDate] = useState(
    new Date('2014-08-18T21:11:54')
  );

  const handleDateChange = date => {
    setSelectedDate(date);
  };

  return (
    <div>
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant='h6' gutterBottom>
            New Soldier
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={6}>
              <TextField
                required
                id='avatar'
                name='avatar'
                label='Avatar'
                fullWidth
                autoComplete='Avatar'
              />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <TextField
                required
                id='name'
                name='name'
                label='Name'
                fullWidth
                autoComplete='name'
              />
              <FormControl required fullWidth>
                <InputLabel htmlFor='rank-native-helper'>Rank</InputLabel>
                <Select
                  native
                  value={userRank}
                  onChange={handleRank}
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
                name='spacing'
                aria-label='sex'
                value={sex2}
                onChange={handleSex}
                row
              >
                <FormLabel className={classes.sex}>Sex: </FormLabel>
                {['Male', 'Female'].map(sex2 => (
                  <FormControlLabel
                    value={sex2}
                    control={<Radio />}
                    label={sex2}
                  />
                ))}
              </RadioGroup>

              {/* <TextField
                required
                id='startdate'
                name='startdate'
                label='Start Date'
                fullWidth
                autoComplete='startdate'
              /> */}

              <KeyboardDatePicker
                margin='normal'
                id='date-picker-dialog'
                label='Date picker dialog'
                format='MM/dd/yyyy'
                value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date'
                }}
              />

              <TextField
                required
                id='phone'
                name='phone'
                label='Office Phone'
                fullWidth
                autoComplete='phone'
              />

              <TextField
                required
                id='email'
                name='email'
                label='Email'
                fullWidth
                autoComplete='email'
              />

              <FormControl required fullWidth>
                <InputLabel htmlFor='superior-native-helper'>
                  Superior
                </InputLabel>
                <Select
                  native
                  value={userSuperior}
                  onChange={handleSuperior}
                  inputProps={{
                    name: 'superior',
                    id: 'superior-native-helper'
                  }}
                >
                  <option value='' />
                  {superiorList.map(superior => {
                    return <option value={superior}>{superior}</option>;
                  })}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
      </main>
      {createSuccess ? (
        <Redirect to='/' />
      ) : isLoading ? (
        <Loading />
      ) : (
        <div>
          <div className='create'>Create User</div>
          <div className='container'>
            <form onSubmit={e => handleCreate(e)}>
              <small className='form-text text-muted'>
                Blank with * is reuiqred
              </small>
              <div className='form-group'>
                * First Name:{' '}
                <input
                  className='form-control'
                  name='firstname'
                  value={firstname}
                  onChange={e => handleChange(e)}
                  placeholder='firstname'
                />
                {!firstname && <Alert warning='empty' item='firstname' />}
                {firstname && !/^[a-zA-Z]+$/.test(firstname) && (
                  <Alert warning='invalid' item='firstname' />
                )}
              </div>
              <div className='form-group'>
                * Last Name:{' '}
                <input
                  className='form-control'
                  name='lastname'
                  value={lastname}
                  onChange={e => handleChange(e)}
                  placeholder='lastname'
                />
                {!lastname && <Alert warning='empty' item='lastname' />}
                {lastname && !/^[a-zA-Z]+$/.test(lastname) && (
                  <Alert warning='invalid' item='lastname' />
                )}
              </div>
              <div className='form-group'>
                * Sex:{' '}
                <input
                  className='form-control'
                  name='sex'
                  value={sex}
                  onChange={e => handleChange(e)}
                  placeholder='sex'
                />
                <small className='form-text text-muted'>
                  Valid inputs are f, m, female, or male, not case sensitive
                </small>
                {!sex && <Alert warning='empty' item='sex' />}
                {sex &&
                  ['f', 'm', 'female', 'male'].indexOf(sex.toLowerCase()) ===
                    -1 && <Alert warning='invalid' item='sex' />}
              </div>
              <div className='form-group'>
                * Age:{' '}
                <input
                  className='form-control'
                  name='age'
                  value={age}
                  onChange={e => handleChange(e)}
                  placeholder='age'
                />
                {!age && <Alert warning='empty' item='age' />}
                {age &&
                  (isNaN(age) ||
                    Math.abs(parseInt(age)).toString() !== age.toString()) && (
                    <Alert warning='invalid' item='age' />
                  )}
                {/* test server error here cause server will return err when age is not a number */}
              </div>
              <div className='form-group'>
                * Password:{' '}
                <input
                  className='form-control'
                  type='password'
                  name='password'
                  value={password}
                  onChange={e => handleChange(e)}
                  placeholder='password'
                />
                {!password && <Alert warning='empty' item='password' />}
              </div>
              <div className='form-group'>
                * Repeat:{' '}
                <input
                  className='form-control'
                  type='password'
                  name='repeat'
                  value={repeat}
                  onChange={e => handleChange(e)}
                  placeholder='repeat'
                />
                {!repeat && <Alert warning='empty' item='confirmed password' />}
                {repeat && password !== repeat && (
                  <Alert warning='match' item='password' />
                )}
              </div>
              {error && <Alert warning='server' item='create' />}
              <div className='btn-row'>
                <div className='btn-left'>
                  <button
                    className='btn btn-success'
                    // value='Submit'
                    type='submit'
                    disabled={
                      disableCreate(
                        firstname,
                        lastname,
                        sex,
                        age,
                        password,
                        repeat
                      )
                      // !(
                      //   firstname &&
                      //   lastname &&
                      //   sex &&
                      //   age &&
                      //   password &&
                      //   repeat &&
                      //   password === repeat
                      // )
                    }
                  >
                    <i className='fas fa-arrow-down' /> Add User
                  </button>
                </div>

                <div className='btn-middle' />

                <div className='btn-right'>
                  <button className='btn btn-secondary' onClick={handleBack}>
                    <i className='fas fa-arrow-left' /> Back
                  </button>
                </div>
              </div>
            </form>
            <div className='alert-text'>{alertContent}</div>
          </div>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    alertContent: state.alert.alertContent,
    createSuccess: state.createUser.createSuccess,
    isLoading: state.createUser.isLoading,
    error: state.createUser.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setAlert: alert => dispatch(setAlert(alert)),

    createUser: data => dispatch(createUser(data)),
    initUser: () => dispatch(initUser())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateUser);
