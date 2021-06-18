import React, { useRef, useEffect, useState, memo, useCallback } from 'react'
import './style.less'
import { Button } from "antd"
import { Icon } from '@c'
import PropTypes from 'prop-types'
import api from '@s/api'
const { remote, shell } = window.require('electron')
const { BrowserWindow } = remote

const PrefixCls = 'align-tool'

const Align = ({ props }) => {

  const getCake = async () => {
    const res = await api.getCake()
    console.log(res)
  }

  const openProcess = () => {
    //桌面打开进程用shell
    let newWin = new BrowserWindow({
      width: 500,
      height: 500,
    })

    newWin.loadURL('https://www.baidu.com/');
    newWin.on('close', () => { newWin=null })
  }

  useEffect(async () => {
    console.log(remote.getGlobal('tips'))
    getCake()
  }, []);

  return <div className={PrefixCls}>
    6668
    <Button onClick={openProcess}>打开新的进程</Button>
    <Icon name="file" fill='white' style={{ marginLeft: 100 }} />
  </div>
}

Align.defaultProps = {

}

Align.propTypes = {

}

export default Align
