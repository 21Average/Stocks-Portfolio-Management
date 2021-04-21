/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-multi-comp */

import { createMedia } from '@artsy/fresnel'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  List,
  Menu,
  Segment,
  Sidebar,
  Visibility,
} from 'semantic-ui-react'

import img1 from '../images/landing/facebook1.png';

const { MediaContextProvider, Media } = createMedia({
  breakpoints: {
    mobile: 0,
    tablet: 768,
    computer: 1024,
  },
})

/* Heads up!
 * HomepageHeading uses inline styling, however it's not the best practice. Use CSS or styled
 * components for such things.
 */
const HomepageHeading = ({ mobile }) => (
  <Container text>
    <Header
      as='h1'
      content='Stock Overflow'
      inverted
      style={{
        fontSize: mobile ? '2em' : '4em',
        fontWeight: 'normal',
        marginBottom: 0,
        marginTop: mobile ? '1.5em' : '3em',
      }}
    />
    <Header
      as='h2'
      content='Become a Better Investor with us.'
      inverted
      style={{
        fontSize: mobile ? '1.5em' : '1.7em',
        fontWeight: 'normal',
        marginTop: mobile ? '0.5em' : '1.5em',
      }}
    />
    <Button primary size='huge' href='/register'>
      Get Started
      <Icon name='right arrow' />
    </Button>
  </Container>
)

HomepageHeading.propTypes = {
  mobile: PropTypes.bool,
}

/* Heads up!
 * Neither Semantic UI nor Semantic UI React offer a responsive navbar, however, it can be implemented easily.
 * It can be more complicated, but you can create really flexible markup.
 */
class DesktopContainer extends Component {
  state = {}

  hideFixedMenu = () => this.setState({ fixed: false })
  showFixedMenu = () => this.setState({ fixed: true })

  render() {
    const { children } = this.props
    const { fixed } = this.state

    return (
      <Media greaterThan='mobile'>
        <Visibility
          once={false}
          onBottomPassed={this.showFixedMenu}
          onBottomPassedReverse={this.hideFixedMenu}
        >
          <Segment
            inverted
            textAlign='center'
            style={{ minHeight: 700, padding: '1em 0em' }}
            vertical
          >
            <Menu
              fixed={fixed ? 'top' : null}
              inverted={!fixed}
              pointing={!fixed}
              secondary={!fixed}
              size='large'
            >
              <Container>
                
                <Menu.Item position='right'>
                  <Button as='a' inverted={!fixed} href='/login'>
                    Log in
                  </Button>
                  <Button as='a' inverted={!fixed} primary={fixed} style={{ marginLeft: '0.5em' }} href='/register'>
                    Sign Up
                  </Button>
                </Menu.Item>
              </Container>
            </Menu>
            <HomepageHeading />
          </Segment>
        </Visibility>

        {children}
      </Media>
    )
  }
}

DesktopContainer.propTypes = {
  children: PropTypes.node,
}

const ResponsiveContainer = ({ children }) => (
  /* Heads up!
   * For large applications it may not be best option to put all page into these containers at
   * they will be rendered twice for SSR.
   */
  <MediaContextProvider>
    <DesktopContainer>{children}</DesktopContainer>
  </MediaContextProvider>
)

ResponsiveContainer.propTypes = {
  children: PropTypes.node,
}

const HomepageLayout = () => (
  <ResponsiveContainer>
    <Segment style={{ padding: '8em 0em' }} vertical>
      <Grid container stackable verticalAlign='middle'>
        <Grid.Row>
          <Grid.Column width={8}>
            <Header as='h3' style={{ fontSize: '2em' }}>
              All your investments in one place
            </Header>
            <p style={{ fontSize: '1.33em' }}>
              Keeping track of investments can be a hassle. Stock Overflow makes it simple with automatic update,
              in-depth research recommendations, and performance reporting. All in an easy-to-use online application.

            </p>
          </Grid.Column>
          <Grid.Column floated='right' width={6}>
            <Image src = {img1} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>

    <Grid stackable container>  
    <Divider hidden section />

        <Grid.Row columns="three">
            <Grid.Column>
                <Header size="huge" as="h1">
                    Your true performance
                </Header>
                <p>
                    Understanding exactly how your investments are performing with daily updates, 
                    plus powerful reports and optional email alerts.
                </p>
                <Button size="small" primary>
                    View details &raquo;
                </Button>
            </Grid.Column>
            <Grid.Column>
                <Header size="huge" as="h1">
                    Get the latest updates.
                </Header>
                <p>
                    Get indepth background research and news updates on your investments. 
                </p>
                <br/>
                <Button size="small" primary>
                    View details &raquo;
                </Button>
            </Grid.Column>
            <Grid.Column>
                <Header size="huge" as="h1">
                    Save time and money
                </Header>
                <p>
                    Import and export your portfoios and tax reports with your accountant and other 
                    services and you'll be saving time and money during tax time.
                </p>
                <Button size="small" primary>
                    View details &raquo;
                </Button>
            </Grid.Column>
        </Grid.Row>
    </Grid>

    <Divider hidden section />

    <Segment style={{ padding: '8em 0em' }} vertical textAlign='center'>
      <Container text>
        <Header as='h3' style={{ fontSize: '2em' }} textAlign='center'>
          Pricing
        </Header>
        <p style={{ fontSize: '1.33em' }} >
          All your holdings are free!
        </p>
        <Button as='a' size='large'>
          Read More
        </Button>

      </Container>
    </Segment>

    <Segment inverted vertical style={{ padding: '5em 0em' }}>
      <Container>
        <Grid divided inverted stackable>
          <Grid.Row>
            <Grid.Column width={3}>
              <Header inverted as='h4' content='About' />
              <List link inverted>
                <List.Item as='a'>Sitemap</List.Item>
                <List.Item as='a'>Contact Us</List.Item>
              </List>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </Segment>
  </ResponsiveContainer>
)

export default HomepageLayout