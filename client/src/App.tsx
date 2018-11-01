import { Formik, FormikActions, FormikProps } from 'formik';
import * as React from 'react';
import './App.css';

class App extends React.Component {
  public handleSubmit(values: any, actions: FormikActions<{ name: string; }>) {
    setTimeout(() => {
      alert(JSON.stringify(values, null, 2));
      actions.setSubmitting(false);
    }, 1000);
  }

  public formikRender(props: FormikProps<any>) {
    return (
      <form onSubmit={props.handleSubmit}>
        <input
          type="text"
          onChange={props.handleChange}
          onBlur={props.handleBlur}
          value={props.values.name}
          name="name"
        />
        {props.errors.name && <div id="feedback">{props.errors.name}</div>}
        <button type="submit">Submit</button>
      </form>
    );
  }

  public render() {
    return (
      <div className="App">
        <Formik
          initialValues={{ name: 'jared' }}
          onSubmit={this.handleSubmit}
          render={this.formikRender}
        />
      </div>
    );
  }
}

export default App;
