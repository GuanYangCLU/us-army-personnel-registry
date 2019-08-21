import React, { useState, useEffect } from 'react';
import {
  setUserList,
  loadNextPage,
  resetConfig
} from '../redux/action-creators/users';
import { connect } from 'react-redux';
import {
  initUser,
  initEdit,
  deleteUser,
  changeSortType,
  changeSearchText
} from '../redux/action-creators/users';
import { Loading, Alert } from './utils';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';

// import MaterialTable from 'material-table';
import { fade, withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Icon from '@material-ui/core/Icon';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

const Home = ({
  users,
  setUserList,
  history,
  initUser,
  initEdit,
  deleteUser,
  loadNextPage,
  isLoading,
  config,
  resetConfig,
  error,
  deleteError,
  alertContent,
  changeSortType,
  changeSearchText
  // lock
}) => {
  const { pageSize, pageNumber, sortType, searchText, superiorId } = config;
  const [query, setQuery] = useState('');
  const handleSearch = e => {
    setQuery(e.target.value);
    changeSearchText(e.target.value);
    setUserList(config);
  };

  useEffect(() => {
    initUser();
    initEdit();
    // loadNextPage(config, users);
    setUserList(config);
  }, []);

  const handleCreate = e => {
    history.push('/createuser');
  };

  const handleEdit = id => {
    history.push(`/edituser/${id}`);
  };

  const handleDelete = (id, users) => {
    deleteUser(id, users);
  };

  const order = [
    'name',
    'sex',
    'rank',
    'startdate',
    'phone',
    'email',
    'superiorname'
  ];
  const [asc, setAsc] = useState(true);
  const handleSort = e => {
    const typ = order.indexOf(e.target.id);
    if (asc) {
      setAsc(!asc);
      changeSortType(2 * typ + 1);
      setUserList(config);
    } else {
      setAsc(!asc);
      changeSortType(2 * typ + 2);
      setUserList(config);
    }
    // console.log(e.target.id);
  };

  const StyledTableCell = withStyles(theme => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white
    },
    body: {
      fontSize: 14
    }
  }))(TableCell);

  const StyledTableRow = withStyles(theme => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.background.default
      }
    }
  }))(TableRow);

  const useStyles = makeStyles(theme => ({
    root: {
      width: '100%',
      marginTop: theme.spacing(3),
      overflowX: 'auto'
    },
    table: {
      minWidth: 700
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    title: {
      flexGrow: 1,
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block'
      }
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25)
      },
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto'
      }
    },
    searchIcon: {
      width: theme.spacing(7),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    inputRoot: {
      color: 'inherit'
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 7),
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: 120,
        '&:focus': {
          width: 200
        }
      }
    },
    avatar: {
      margin: 10
    },
    bigAvatar: {
      margin: 10,
      width: 60,
      height: 60
    },
    fab: {
      margin: theme.spacing(1)
    },
    extendedIcon: {
      marginRight: theme.spacing(1)
    }
  }));

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position='static'>
        <Toolbar>
          {/* <IconButton
            edge='start'
            className={classes.menuButton}
            color='inherit'
            aria-label='open drawer'
          >
            <MenuIcon />
          </IconButton> */}
          <Typography className={classes.title} variant='h6' noWrap>
            US Army Personnel Registry
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder='Search…'
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput
              }}
              value={query}
              onChange={e => {
                handleSearch(e);
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
          <Button
            // variant='contained'
            color='inherit'
            onClick={resetConfig}
          >
            Reset
          </Button>
          <Fab
            color='secondary'
            aria-label='add'
            className={classes.fab}
            onClick={e => handleCreate()}
          >
            <AddIcon />
          </Fab>
        </Toolbar>
      </AppBar>
      <div>
        {isLoading ? (
          <Loading />
        ) : (
          <div>
            <Paper className={classes.root}>
              <Table className={classes.table} size='small'>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Avatar</StyledTableCell>
                    <StyledTableCell
                      align='right'
                      onClick={e => {
                        handleSort(e);
                      }}
                      id='name'
                    >
                      Name
                      <span style={{ position: 'relative', top: 5 }}>
                        {config.sortType === 1 && <ArrowUpwardIcon />}
                        {config.sortType === 2 && <ArrowDownwardIcon />}
                      </span>
                    </StyledTableCell>
                    <StyledTableCell
                      align='right'
                      onClick={e => {
                        handleSort(e);
                      }}
                      id='sex'
                    >
                      Sex
                      <span style={{ position: 'relative', top: 5 }}>
                        {config.sortType === 3 && <ArrowUpwardIcon />}
                        {config.sortType === 4 && <ArrowDownwardIcon />}
                      </span>
                    </StyledTableCell>
                    <StyledTableCell
                      align='right'
                      onClick={e => {
                        handleSort(e);
                      }}
                      id='rank'
                    >
                      Rank
                      <span style={{ position: 'relative', top: 5 }}>
                        {config.sortType === 5 && <ArrowUpwardIcon />}
                        {config.sortType === 6 && <ArrowDownwardIcon />}
                      </span>
                    </StyledTableCell>
                    <StyledTableCell
                      align='right'
                      onClick={e => {
                        handleSort(e);
                      }}
                      id='startdate'
                    >
                      Start Date
                      <span style={{ position: 'relative', top: 5 }}>
                        {config.sortType === 7 && <ArrowUpwardIcon />}
                        {config.sortType === 8 && <ArrowDownwardIcon />}
                      </span>
                    </StyledTableCell>
                    <StyledTableCell
                      align='right'
                      onClick={e => {
                        handleSort(e);
                      }}
                      id='phone'
                    >
                      Phone
                      <span style={{ position: 'relative', top: 5 }}>
                        {config.sortType === 9 && <ArrowUpwardIcon />}
                        {config.sortType === 10 && <ArrowDownwardIcon />}
                      </span>
                    </StyledTableCell>
                    <StyledTableCell
                      align='right'
                      onClick={e => {
                        handleSort(e);
                      }}
                      id='email'
                    >
                      Email
                      <span style={{ position: 'relative', top: 5 }}>
                        {config.sortType === 11 && <ArrowUpwardIcon />}
                        {config.sortType === 12 && <ArrowDownwardIcon />}
                      </span>
                    </StyledTableCell>
                    <StyledTableCell
                      align='right'
                      onClick={e => {
                        handleSort(e);
                      }}
                      id='superiorname'
                    >
                      Superior
                      <span style={{ position: 'relative', top: 5 }}>
                        {config.sortType === 13 && <ArrowUpwardIcon />}
                        {config.sortType === 14 && <ArrowDownwardIcon />}
                      </span>
                    </StyledTableCell>
                    <StyledTableCell align='right'># of D.S.</StyledTableCell>
                    <StyledTableCell align='center'>Edit</StyledTableCell>
                    <StyledTableCell align='center'>Delete</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map(user => (
                    <StyledTableRow key={user._id}>
                      <StyledTableCell component='th' scope='row'>
                        <Grid container justify='center' alignItems='center'>
                          <Avatar
                            alt='Remy Sharp'
                            src={user.avatar}
                            className={classes.avatar}
                          />
                          {/* <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" className={classes.bigAvatar} /> */}
                        </Grid>
                      </StyledTableCell>
                      <StyledTableCell align='right'>
                        {user.name}
                      </StyledTableCell>
                      <StyledTableCell align='right'>
                        {user.sex}
                      </StyledTableCell>
                      <StyledTableCell align='right'>
                        {user.rank}
                      </StyledTableCell>
                      <StyledTableCell align='right'>
                        {user.startdate.slice(0, 10)}
                      </StyledTableCell>
                      <StyledTableCell align='right'>
                        <a href={'tel: ' + user.phone}>{user.phone}</a>
                      </StyledTableCell>
                      <StyledTableCell align='right'>
                        <a href={'mailto: ' + user.email}>{user.email}</a>
                      </StyledTableCell>
                      <StyledTableCell align='right'>
                        {user.superiorname}
                      </StyledTableCell>
                      <StyledTableCell align='right'>
                        {user.directsubordinates.length}
                      </StyledTableCell>
                      <StyledTableCell align='right'>
                        <Fab
                          color='secondary'
                          aria-label='edit'
                          className={classes.fab}
                          onClick={() => {
                            handleEdit(user._id);
                          }}
                        >
                          {/* <Icon>edit_icon</Icon> */}
                          <EditIcon />
                        </Fab>
                      </StyledTableCell>
                      <StyledTableCell align='right'>
                        <Fab
                          // disabled
                          aria-label='delete'
                          className={classes.fab}
                          onClick={() => {
                            handleDelete(user._id, users);
                          }}
                        >
                          <DeleteIcon />
                        </Fab>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>

            {error && <h4>No more soldiers</h4>}

            <InfiniteScroll
              dataLength={users.length}
              next={() => {
                // if (!lock) {
                loadNextPage(config, users);
                // }
              }}
              hasMore={users.length / pageSize === pageNumber - 1}
              loader={<h4>Loading...</h4>}
              endMessage={
                <p style={{ textAlign: 'center' }}>
                  <b>Yay! You have seen it all</b>
                </p>
              }
              // refreshFunction={this.refresh}
              // pullDownToRefresh
              // pullDownToRefreshContent={
              //   <h3 style={{ textAlign: 'center' }}>
              //     &#8595; Pull down to refresh
              //   </h3>
              // }
              // releaseToRefreshContent={
              //   <h3 style={{ textAlign: 'center' }}>
              //     &#8593; Release to refresh
              //   </h3>
              // }
            >
              <div style={{ color: 'white' }}>
                {users.map(user => {
                  return (
                    <li>
                      <h1>{user.name}</h1>
                    </li>
                  );
                })}
              </div>
            </InfiniteScroll>
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    users: state.users.users,
    isLoading: state.users.isLoading,
    error: state.users.error,
    deleteError: state.users.deleteError,
    config: state.users.config,
    alertContent: state.alert.alertContent
    // lock: state.users.lock
  };
};

const mapStateToDispatch = dispatch => {
  return {
    setUserList: config => dispatch(setUserList(config)),
    initUser: () => dispatch(initUser()),
    initEdit: () => dispatch(initEdit()),
    deleteUser: (id, users) => dispatch(deleteUser(id, users)),
    loadNextPage: (config, users) => dispatch(loadNextPage(config, users)),
    resetConfig: () => dispatch(resetConfig()),
    changeSortType: typ => dispatch(changeSortType(typ)),
    changeSearchText: query => dispatch(changeSearchText(query))
  };
};

export default connect(
  mapStateToProps,
  mapStateToDispatch
)(Home);
