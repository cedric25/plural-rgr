import React from 'react'
import Relay from 'react-relay'
import {debounce} from 'lodash'

import Link from './Link'
import CreateLinkMutation from '../mutations/CreateLinkMutation'

class Main extends React.Component {

  constructor(props) {
    super(props)
    this.search = this.debounceEventHandler(this.search, 300)
  }

  // To prevent React nullifies the event you must call event.persist()
  // http://stackoverflow.com/questions/35435074/using-debouncer-with-react-event
  // https://facebook.github.io/react/docs/events.html
  debounceEventHandler(...args) {
    const debounced = debounce(...args)
    return function(e) {
      e.persist()
      return debounced(e)
    }
  }

  search = (e) => {
    let query = e.target.value
    this.props.relay.setVariables({ query })
  }

  setLimit = (e) => {
    let newLimit = Number(e.target.value)
    this.props.relay.setVariables({
      limit: newLimit
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    Relay.Store.commitUpdate(
      new CreateLinkMutation({
        title: this.refs.newTitle.value,
        url: this.refs.newUrl.value,
        store: this.props.store
      })
    )
    this.refs.newTitle.value = ''
    this.refs.newUrl.value = ''
  }

  render() {
    let content = this.props.store.linkConnection.edges.map(edge => {
      return (
        <Link key={edge.node.id} link={edge.node} />
      )
    })
    return (
      <div>
        <h3>Links</h3>

        <form onSubmit={this.handleSubmit}>
          <input type="text" placeholder="Title" ref="newTitle" />
          <input type="text" placeholder="Url" ref="newUrl" />
          <button type="submit">Add</button>
        </form>

        <input type="text" placeholder="Search" onChange={this.search} />

        Showing:
        <select onChange={this.setLimit}
                         defaultValue={this.props.relay.variables.limit}>
          <option value="5">5</option>
          <option value="50">50</option>
        </select>

        <ul>
          {content}
        </ul>
      </div>
    )
  }
}

// Declare the data requirement for this component
Main = Relay.createContainer(Main, {
  initialVariables: {
    limit: 50,
    query: ''
  },
  fragments: {
    store: () => Relay.QL`
      fragment on Store {
        id,
        linkConnection(first: $limit, query: $query) {
          edges {
            node {
              id,
              ${Link.getFragment('link')}  
            }
          }
        }
      }
      `
  }
})

export default Main
