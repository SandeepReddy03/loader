import {Component} from 'react'

import {Loader} from 'react-loader-spinner'

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

import Header from './components/Header'
import ProjectItem from './components/ProjectItem'

import './App.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class App extends Component {
  state = {
    inputText: categoriesList[0].id,
    apiStatus: apiStatusConstants.initial,
    projectsList: [],
  }

  componentDidMount() {
    this.getProducts()
  }

  onClickButton = () => {
    this.getProducts()
  }

  getProducts = async () => {
    const {inputText} = this.state
    const projectApiUrl = `https://apis.ccbp.in/ps/projects?category=${inputText}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(projectApiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = data.projects.map(eachProject => ({
        id: eachProject.id,
        imageUrl: eachProject.image_url,
        name: eachProject.name,
      }))
      this.setState({
        projectsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onChangeInput = event => {
    this.setState({inputText: event.target.value}, this.getProducts)
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        className="failure-img"
        alt="failure view"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-para">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        className="failure-button"
        onClick={this.onClickButton}
      >
        Retry
      </button>
    </div>
  )

  renderProjectsListView = () => {
    const {projectsList} = this.state
    return (
      <div>
        <ul className="success-view">
          {projectsList.map(eachProject => (
            <ProjectItem key={eachProject.id} eachProject={eachProject} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoadingView = () => (
    <>
      <div className="product-loader-view" testid="loader">
        <Loader type="ThreeDots" color="#328af2" height={50} width={50} />
      </div>
    </>
  )

  renderTypeOfApi = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderProjectsListView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {inputText} = this.state
    return (
      <div className="bg-container">
        <Header />
        <div className="input-and-projects-container">
          <select
            className="select-element"
            value={inputText}
            onChange={this.onChangeInput}
          >
            {categoriesList.map(eachOne => (
              <option
                value={eachOne.id}
                key={eachOne.id}
                className="select-option"
              >
                {eachOne.displayText}
              </option>
            ))}
          </select>
          {this.renderTypeOfApi()}
        </div>
      </div>
    )
  }
}

export default App
