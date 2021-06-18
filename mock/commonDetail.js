module.exports = {
  // GET 可忽略

  'GET /mock/cakeChart': {
    "message": '错误信息',
    "status": 200,
    'result': [
      {
        name: 'text1',
        type: 'chatTime',
        children: {
          id: Math.random(),
          data: [
            { type: 'car', value: 93.33 },
            { type: 'phone', value: 6.67 }
          ]
        },
      },
    ],
  }

}
