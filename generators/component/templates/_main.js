'use strict';

require('common/<%= ComponentName %>.sass');

class <%= ComponentName %> extends React.Component{
  render() {
    return (
      <div className='<%= ComponentName %>'>
        
      </div>
    );
  }
}
<%= ComponentName %>.PropTypes = {
  
};
<%= ComponentName %>.Mixins = [ImmutableRenderMixin];

module.exports = <%= ComponentName %>;