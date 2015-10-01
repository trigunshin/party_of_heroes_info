// base_hero_stats
// hero_levels
// rarities

var InfoAffix = React.createClass({
  render: function() {
    return (
      <div className='col-md-offset-4 col-md-4 affix' data-spy="affix">
        
      </div>
    );
  }
});

var HeroForm = React.createClass({
  getDefaultProps: function() {
    return {
      heroes: base_hero_stats,
      levels: hero_levels,
      rarities: rarities
    };
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var hero = React.findDOMNode(this.refs.hero_name).value.trim();
    var rarity = React.findDOMNode(this.refs.rarity_type).value.trim();
    var level = React.findDOMNode(this.refs.level_index).value.trim();
    var ret = {'hero': hero, 'level': level, 'rarity': rarity};

    this.props.onSubmitHero(ret);
    return;
  },

  render: function() {
    // create option elements for each heroname
    var hero_options = [];
    _.each(_.values(this.props.heroes), function(hero) {
      hero_options.push(<option value={hero.name}>{hero.name}</option>);
    });
    // create option elements for each level
    var level_options = [];
    _.each(_.values(this.props.levels), function(level) {
      level_options.push(<option value={level.id}>{parseInt(level.Id, 10)+1}</option>);
    });
    // create option elements for each rarity
    var rarity_options = []
    _.each(_.values(this.props.rarities), function(rarity) {
      rarity_options.push(<option value={rarity.name}>{rarity.name}</option>);
    });

    return (
      <form id='hero_submit_form' className="form-inline" onSubmit={this.handleSubmit}>
        <div className="form-group">
          <div className="input-group">
            <select id='hero_name_selector' name='hero_name' ref='hero_name' className="form-control">
              {hero_options}
            </select>
          </div>
          <div className="input-group">
            <select id='rarity_selector' name='rarity_type' ref='rarity_type' className="form-control">
              {rarity_options}
            </select>
          </div>
          <div className="input-group">
            <select id='level_selector' name='level_index' ref='level_index' className="form-control">
              {level_options}
            </select>
          </div>
        </div>
        <button type="submit" className="btn btn-default">Add</button>
      </form>
    );
  }
});

var Hero = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  _getImage: function(base_hero) {
    if(base_hero.hero_type === 'Melee') return '/static/img/melee.png';
    else if(base_hero.hero_type === 'Ranged') return '/static/img/ranged.png';
    else return '/static/img/arcane.png';
  },
  getInitialState: function() {
    return {
      hero_name: this.props.heroInit.hero,
      hero_level: this.props.heroInit.level,
      hero_rarity: this.props.heroInit.rarity
    };
  },
  get_stat: function(stat_multi, rarity_multi, base) {
    // divide by 4096 due to raw number from game file
    return Math.floor((stat_multi/4096) * base * (rarity_multi/4096));
  },
  render: function() {
    var cur_level = hero_levels[parseInt(this.state.hero_level, 10) -1];
    var base_hero = base_hero_stats[this.state.hero_name];

    var stat_fn = _.partial(
      this.get_stat,
      cur_level.HealthMultiplier,
      cur_level[rarities[this.state.hero_rarity].level_prop]);

    // create option elements for each heroname
    var hero_options = [];
    _.each(_.values(base_hero_stats), function(hero) {
      hero_options.push(<option value={hero.name}>{hero.name}</option>);
    });
    // create option elements for each level
    var level_options = [];
    _.each(_.values(hero_levels), function(level) {
      level_options.push(<option value={level.id}>{parseInt(level.Id, 10)+1}</option>);
    });
    // create option elements for each rarity
    var rarity_options = []
    _.each(_.values(rarities), function(rarity) {
      rarity_options.push(<option value={rarity.name}>{rarity.name}</option>);
    });

    return (
      <li href="#" className="list-group-item">
        <h4 className="list-group-item-heading">
          L{this.state.hero_level} {this.state.hero_rarity} {this.state.hero_name}
          <span className="label label-default">{base_hero.hero_type}</span>
        </h4>
        <div className='row'>
          <label className="col-md-2">Health</label>
          <div className="col-md-2">
            <span>{stat_fn(base_hero.health)}</span>
          </div>
          <label className="col-md-2">Damage</label>
          <div className="col-md-2">
            <span>{stat_fn(base_hero.dmg)}</span>
          </div>
          <label className="col-md-2">Armor</label>
          <div className="col-md-2">
            <span>{stat_fn(base_hero.armor)}</span>
          </div>
        </div>
        <div className='row'>
          <label className="col-md-2">Active</label>
          <div className="col-md-2">
            <span>{cur_level.ActiveSkillLevel +1}</span>
          </div>
          <label className="col-md-2">Passive 1</label>
          <div className="col-md-2">
            <span>{cur_level.PassiveSkill1Level +1}</span>
          </div>
          <label className="col-md-2">Passive 2</label>
          <div className="col-md-2">
            <span>{cur_level.PassiveSkill2Level +1}</span>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-2'>
            <select id='hero_name_selector' valueLink={this.linkState('hero_name')} className="input-sm">
              {hero_options}
            </select>
          </div>
          <div className='col-md-2'>
            <select id='rarity_selector' valueLink={this.linkState('hero_rarity')} className="input-sm">
              {rarity_options}
            </select>
          </div>
          <div className='col-md-2'>
            <select id='level_selector' valueLink={this.linkState('hero_level')} className="input-sm">
              {level_options}
            </select>
          </div>
        </div>
      </li>
    );
  }
});

var HeroList = React.createClass({
  render: function() {
    var heroNodes = this.props.heroes.map(function (hero) {
      return (
        <Hero heroInit={hero} />
      );
    });
    return (
      <ul className="list-group">
        {heroNodes}
      </ul>
    );
  }
});

var HeroBox = React.createClass({
  componentDidMount: function() {},
  render: function() {
    return (
      <div className="heroBox col-md-8">
        <HeroList heroes={this.props.heroes} />
      </div>
    );
  }
});

var HeroPane = React.createClass({
  getInitialState: function() {
    return {heroes: [ {hero: "Abomination", level: "1", rarity: "Common"}, {hero: "Abomination", level: "1", rarity: "Common"}]};
  },
  handleHeroSubmit: function(hero) {
    var new_heroes = this.state.heroes;
    console.info(hero);
    new_heroes.push(hero);
    this.setState({heroes: new_heroes});
  },
  render: function() {
    return (
      <div>
        <InfoAffix />
        <HeroForm onSubmitHero={this.handleHeroSubmit} />
        <HeroBox heroes={this.state.heroes} />
      </div>
    );
  }
});

React.render(
  <HeroPane />,
  document.getElementById('tab_content_anchor')
);