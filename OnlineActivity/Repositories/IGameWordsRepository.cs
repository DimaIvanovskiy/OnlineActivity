﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using OnlineActivity.Models;

namespace OnlineActivity.Repositories
{
    internal interface IGameWordRepository : IEntityRepository<GameWordEntity>
    {
        public GameWordEntity GetRandomAsync();
    }
}
