import React from 'react'
import Relay from 'react-relay'

import Link from './Link'

class Main extends React.Component {
  setLimit = (e) => {
    console.log('setLimit')
    let newLimit = Number(e.target.value)
    console.log(newLimit)
    this.props.relay.setVariables({
      limit: newLimit
    })
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
        Showing: <select onChange={this.setLimit} defaultValue="2">
          <option value="2">2</option>
          <option value="3">3</option>
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
    limit: 2
  },
  fragments: {
    store: () => Relay.QL`
      fragment on Store {
        linkConnection(first: $limit) {
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
