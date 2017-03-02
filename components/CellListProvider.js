import React from 'react';

import Cell from './Cell';
import SelectList from './SelectList';

import {
  View,
  StyleSheet
} from 'react-native';

export const CellListItem = function(props) {
  return <View {...props} />;
}

class CellListProvider extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      source: null,
      selecting: false
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.selecting !== prevState.selecting) {
      if (this.state.source && this.state.selecting === true) {
        this._selectList.open();
      }
    }
  }

  handleCellListOnPress = (props) => {
    this.setState({
      selecting: true,
      source: { ...props } // notice: not mutating props
    });
  }

  renderChildren(children) {
    return React.Children.map(children, (component, i) => {
      // null child
      if (React.isValidElement(component) === false) return component;

      if (component.type !== CellListItem) {
        if (React.Children.count(component.props.children) === 0) return component;
        else {
          return React.cloneElement(
            component,
            {},
            this.renderChildren(component.props.children)
          );
        }
      }

      return (
        <Cell
          onPress={() => this.handleCellListOnPress(component.props)}
          {...component.props}
        />
      );
    });
  }

  handleSelectListItemOnPress = (selectedItem, onPressCallback) => {
    if (!this.state.source) return;
    onPressCallback(selectedItem);
    this._selectList.close();
  }

  handleSelectListOnClose = () => {
    this.setState({
      selecting: false,
      source: null
    });
  }

  renderSelectList() {
    if (!this.state.source) return;

    const {
      listData,
      listItemTitle,
      listItemSubtitle,
      listItemIcon,
      listItemValidator,
      listSection,
      listSelected,
      listItemOnPress,
      icon
    } = this.state.source;

    return (
      <SelectList
        {...this.props}

        modal
        ref={component => this._selectList = component}
        data={listData}
        itemTitle={listItemTitle}
        itemSubtitle={listItemSubtitle}
        icon={listItemIcon || icon}
        itemSelectedValidator={listItemValidator}
        onItemPress={item => this.handleSelectListItemOnPress(item, listItemOnPress)}
        section={listSection}
        selected={listSelected}
        onClose={this.handleSelectListOnClose}
      />
    );
  }

  render() {
    return (
      <View style={styles.container} >
        {this.renderSelectList()}
        {this.renderChildren(this.props.children)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default CellListProvider;