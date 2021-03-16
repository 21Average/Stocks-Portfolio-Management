import React, {Component} from "react";
import {Segment, Container, Divider, Header, Table} from "semantic-ui-react";

export default class Recommendations extends Component {

  render() {
    // These are sample headers for the table. We can change this depending on the data we get from the backend
    const headerRow = ['Stock', 'Price'];
    // Dummy data - this will change depending on data from backend
    const tableData = [
      {
        name: 'STO1',
        price: '0.014',
      },
      {
        name: 'STO2',
        price: '0.23',
      }
    ];

    return <Container>
      <Segment className={'portfolio'}>
        <Header as={'h1'}>Buy</Header>
        <Table color={'green'}>
          <Table.Header>
            <Table.Row>
              {headerRow.map((header, i) =>
                <Table.HeaderCell key={i}>{header}</Table.HeaderCell>
              )}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {tableData.map(({name, price}, i) =>
              <Table.Row key={i}>
                <Table.Cell>{name}</Table.Cell>
                <Table.Cell>{price}</Table.Cell>
              </Table.Row>)}
          </Table.Body>
        </Table>
      </Segment>
      <Divider hidden/>
      <Segment className={'portfolio'}>
        <Header as={'h1'}>Sell</Header>
        <Table color={'red'}>
          <Table.Header>
            <Table.Row>
              {headerRow.map((header, i) =>
                <Table.HeaderCell key={i}>{header}</Table.HeaderCell>
              )}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {tableData.map(({name, price}, i) =>
              <Table.Row key={i}>
                <Table.Cell>{name}</Table.Cell>
                <Table.Cell>{price}</Table.Cell>
              </Table.Row>)}
          </Table.Body>
        </Table>
      </Segment>
      <Divider hidden/>
      <Segment className={'portfolio'}>
        <Header as={'h1'}>Hold</Header>
        <Table color={'yellow'}>
          <Table.Header>
            <Table.Row>
              {headerRow.map((header, i) =>
                <Table.HeaderCell key={i}>{header}</Table.HeaderCell>
              )}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {tableData.map(({name, price}, i) =>
              <Table.Row key={i}>
                <Table.Cell>{name}</Table.Cell>
                <Table.Cell>{price}</Table.Cell>
              </Table.Row>)}
          </Table.Body>
        </Table>
      </Segment>
    </Container>
  }
}