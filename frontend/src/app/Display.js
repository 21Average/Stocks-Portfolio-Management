import React, {Component} from 'react';
import axios from 'axios';
import {AXIOS_HEADER, BACKEND_URL} from "../defaults";

class Display extends Component {
  constructor(props) {
    // Pass props to parent class
    super(props);
    // Set initial state
    this.state = {
      articles: [],
      qkey: this.props.qkey,
      showError: false,
    };
  }

  // Lifecycle method
  componentWillMount() {
    this.getArticles(this.props.default);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
      this.setState({ url: `https://newsapi.org/v2/everything?q=${this.state.qkey}&sources=${nextProps.default}&apiKey=77b21799ccd841928ffe835d5656adea` });

      this.getArticles(nextProps.default);
    }
  }

  formatDate(date) {
    var time = new Date(date);
    var year = time.getFullYear();
    var day = time.getDate();
    var hour = time.getHours();
    var minute = time.getMinutes();
    var month = time.getMonth() + 1;
    var composedTime = day + '/' + month + '/' + year + ' | ' + hour + ':' + (minute < 10 ? '0' + minute : minute);
    return composedTime;
  }

  getArticles(url) {
    this.setState({showError: false});
    // Make HTTP reques with Axios
    axios
      .get(`https://newsapi.org/v2/everything?q=${this.state.qkey}&sources=${url}&apiKey=77b21799ccd841928ffe835d5656adea`)
      .then(res => {
        const articles = res.data.articles;
        // Set state with result
        console.log(articles);
        const token = localStorage.getItem("token");
        if (token) {
          axios({
            headers: AXIOS_HEADER(token),
            method: 'post', url: `${BACKEND_URL}/stocks/getStockNews/`,
            data: {'news': articles}
          }).then(({data}) => {
            this.setState({articles: data});
          }).catch(({response}) => {
            this.setState({articles: [], showError: true});
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const {articles, showError} = this.state;

    let getColour = (rating) => {
      return rating.includes('Positive') ? 'green' : (rating.includes('Neutral') ? null : 'red')
    };

    return <React.Fragment>{showError ?
      <div><br/><p style={{color: 'grey'}}>No related articles available from this source</p></div> :
      <React.Fragment>{articles ? <div className="cardsContainer">
        {articles.map((news, i) => {
          return (
            <div className="card" key={i}>
              <div className="content">
                <h3>
                  <a href={news.url} target="_blank" rel="noopener noreferrer">
                    {news.title}
                  </a>
                </h3>
                <p>{news.description}</p>
                <div className="author">
                  <p>
                    By <i>{news.author ? news.author : this.props.default}</i>
                  </p>
                  <p>{this.formatDate(news.publishedAt)}</p>
                  <p>Rating: <span
                    style={{color: getColour(news.rating[0])}}>{news.rating[0]} ({news.rating[1].toFixed(3)})</span></p>
                </div>
              </div>
              <div className="image">
                <img src={news.urlToImage} alt="News Article Image" />
              </div>
            </div>
          );
        })}
      </div> : null}</React.Fragment>}
    </React.Fragment>
  }
}

export default Display;