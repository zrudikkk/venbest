import './App.css';
import React, { Component } from 'react';

function Row(props) {
      const {cells} = props;
      let sex = cells.sex === 'm' ? 'мужской' : 'женский';
      return (
            <div className="row">
                 <div><span>{cells.name}</span> <span>{cells.lastname}</span></div>
                  <div>Возраст: {cells.age}</div>
                  <div>Пол: {sex}</div>
            </div>
      )
}


function Table(props) {
      const rows = [...props.data];
      return (
            <div className='table'>
            {rows.map((it, id) =>
                  <Row cells={it} key={id} />
            )}
            </div>
      )
  }

  function Inputs(props) {
        let changer = props.changer;
        return <div className='inputs' onChange={(e) => changer(e)}>
              <div>Имя: <input data-header='name'/></div>
              <div>Фамилия: <input data-header='lastname'/></div>
              <div>Возраст: <input data-header='age'/></div>
              <div>Пол: <input type='checkbox' data-header='male' defaultChecked/> Мужской
              <input type='checkbox' data-header='female' defaultChecked/> Женский</div>
        </div>;
  }

class App extends React.Component {
      constructor(props) {
            super(props);
            this.state = {name: '', lastname: '', age: '', male: false, female: false};
            this.onChange = this.onChange.bind(this);
            this.data = '';
      }

      componentDidMount() {
            this.getData(this.props.url).then(data => {
            this.data = data;
            this.setState({male: true, female: true});
      });
      }

     async getData(url) {
            let data = await fetch(url)
            .then((response) => response.json());
            return data;
      }

      onChange(e) {
            switch(e.target.dataset.header) {
                  case 'name':
                  this.setState({name: e.target.value});
                  break;
                  case 'lastname':
                  this.setState({lastname: e.target.value});
                  break;
                  case 'age':
                  this.setState({age: e.target.value});
                  break;
                  case 'male':
                  this.setState((prevState) => ({male: !prevState.male}));
                  break;
                  default: 
                  this.setState((prevState) => ({female: !prevState.female}));
                  break;
            }
            
      }

      render() {

            if (!this.data.length) {
                  return 'Loading...';
            } else {

                  let data = [...this.data].filter(it =>
                        it.name.toLowerCase().startsWith(this.state.name.toLowerCase()) &&
                  it.lastname.toLowerCase().startsWith(this.state.lastname.toLowerCase())  &&
                  (it.age == this.state.age || !this.state.age) &&
                  ((it.sex === 'm' && this.state.male) || (it.sex === 'f' && this.state.female))
                  );

                  return <div className='app'>
                        <Inputs changer={this.onChange}/>
                        <Table data={data}/>
                        </div>
            }
      }
}

export default App;
