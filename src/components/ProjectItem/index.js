import './index.css'

const ProjectItem = props => {
  const {eachProject} = props
  const {name, imageUrl} = eachProject
  return (
    <li className="list-item">
      <img src={imageUrl} alt={name} className="project-img" />
      <p className="project-para">{name}</p>
    </li>
  )
}
export default ProjectItem
