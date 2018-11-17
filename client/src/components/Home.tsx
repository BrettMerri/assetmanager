import { Formik, FormikActions, FormikProps } from 'formik';
import * as React from 'react';

class Home extends React.Component {
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
      <div className="home">
        <Formik
          initialValues={{ name: 'test' }}
          onSubmit={this.handleSubmit}
          render={this.formikRender}
        />
      </div>
    );
  }
}

export default Home;
