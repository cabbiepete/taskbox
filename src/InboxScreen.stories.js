import React from 'react'
import { rest } from 'msw'
import { InboxScreen } from './InboxScreen'
import { Default as TaskListDefault } from './components/TaskList.stories'
import { within, userEvent, waitFor, expect } from '@storybook/testing-library'

export default {
  component: InboxScreen,
  title: 'InboxScreen',
}

const Template = (args) => <InboxScreen {...args} />

export const Default = Template.bind({})
Default.parameters = {
  msw: [
    rest.get('/tasks', (req, res, ctx) => {
      return res(ctx.json(TaskListDefault.args))
    }),
  ],
}
Default.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const { queryByText, getByRole } = canvas

  // screen.debug()
  console.log('here 1')
  await waitFor(() => {
    expect(queryByText('You have no tasks')).not.toBeInTheDocument()
  })

  const getTask = () => getByRole('listitem', { name: 'Export logo' })

  const pinButton = within(getTask()).getByRole('button', { name: 'pin' })

  await userEvent.click(pinButton)
}

export const Error = Template.bind({})
Error.args = {
  error: 'Something',
}
Error.parameters = {
  msw: [
    rest.get('/tasks', (req, res, ctx) => {
      return res(ctx.json([]))
    }),
  ],
}
