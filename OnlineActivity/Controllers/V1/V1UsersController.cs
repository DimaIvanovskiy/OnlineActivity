﻿using System;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using OnlineActivity.Models;
using OnlineActivity.Repositories;
using OnlineActivity.Result;

namespace OnlineActivity.Controllers.V1
{
    [Route("api/v1/users")]
    public sealed class V1UsersController : V1ControllerBase
    {
        private readonly IUserRepository userRepository;
        private readonly IMapper mapper;

        public V1UsersController(IUserRepository userRepository, IMapper mapper)
        {
            this.userRepository = userRepository;
            this.mapper = mapper;
        }

        [HttpPost]
        public async Task<IActionResult> CreateUserAsync([FromBody] UserToCreateDto userToCreateDto)
        {
            var userEntity = mapper.Map<UserEntity>(userToCreateDto);
            userEntity = await userRepository.InsertAsync(userEntity);
            var userToSendDto = mapper.Map<UserToSendDto>(userEntity);
            return CreatedAtRoute("GetUserById", new CreatedUserRouteValue(userToSendDto.Id), userToSendDto);
        }

        [HttpPut]
        public async Task<IActionResult> CreateOrUpdateUserAsync([FromBody] UserToPutDto userToPutDto)
        {
            var userEntity = mapper.Map<UserEntity>(userToPutDto);
            userEntity = await userRepository.InsertOrUpdateByLoginAsync(userEntity);
            var userToSendDto = mapper.Map<UserToSendDto>(userEntity);

            return Ok(userToSendDto);
        }

        [HttpGet("{userId}", Name = "GetUserById")]
        public async Task<IActionResult> GetUserByIdAsync([FromRoute] Guid userId)
        {
            var userEntity = await userRepository.GetAsync(userId);
            var userToSendDto = mapper.Map<UserToSendDto>(userEntity);
            return Ok(userToSendDto);
        }
    }
}
