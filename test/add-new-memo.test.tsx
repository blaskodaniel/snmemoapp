import React from 'react'
import { mount } from 'enzyme'
import { TextField } from '@material-ui/core'
import { act } from 'react-dom/test-utils'
import { AddNew } from '../src/components/add-new-memo'

describe('Add new memo panel', () => {
  const addnewprops = {
    show: true,
    onCreate: jest.fn(),
    onClose: jest.fn(),
  }
  it('Snapshot', () => {
    const wrapper = mount(<AddNew {...addnewprops} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('Create memo', () => {
    const wrapper = mount(<AddNew {...addnewprops} />)
    const textfieldTitle = wrapper.find(TextField).at(0)
    const textfieldDesc = wrapper.find(TextField).at(1)

    act(() => {
      ;(textfieldTitle.prop('onChange') as any)({ target: { value: 'New memo title' } })
    })

    act(() => {
      ;(textfieldDesc.prop('onChange') as any)({ target: { value: 'New memo description' } })
    })

    expect(
      textfieldTitle
        .find('textarea')
        .at(0)
        .text(),
    ).toEqual('New memo title')
    expect(
      textfieldDesc
        .find('textarea')
        .at(0)
        .text(),
    ).toEqual('New memo description')

    const createbtn = wrapper.update().find('button[aria-label="Create"]')
    act(() => {
      createbtn.simulate('click')
    })

    expect(
      textfieldTitle
        .find('textarea')
        .at(0)
        .text(),
    ).toEqual('')
    expect(
      textfieldDesc
        .find('textarea')
        .at(0)
        .text(),
    ).toEqual('')
  })
})
